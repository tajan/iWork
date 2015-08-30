Imports System.Net
Imports System.Net.Http
Imports System.Web.Http
Imports Web.Repositories.EF
Imports Microsoft.Owin
Imports Microsoft.AspNet.Identity.Owin
Imports Microsoft.AspNet.Identity
Imports System.Linq.Expressions
Imports System.Data.Entity

Namespace Controllers

    Public Class TaskController
        Inherits BaseController

#Region " Private Members "

        Private Function GetAvailableQuery() As IQueryable(Of Task)

            Dim out = (From p In Me.TaskRepository.GetAll.Include(Function(x) x.UserStory).Include(Function(x) x.Project).Include(Function(x) x.TaskMembers).Include("TaskMembers.User").Include(Function(x) x.Activities).Include(Function(x) x.TaskFiles)
                       Where
                       p.Project.ProjectMembers.Any(Function(x) x.UserId = CurrentUserId AndAlso x.MembershipType = 1) OrElse
                       p.TaskMembers.Any(Function(x) x.UserId = CurrentUserId) OrElse
                       (p.Project.ProjectMembers.Any(Function(x) x.UserId = CurrentUserId AndAlso x.MembershipType = 2) AndAlso p.TaskMembers.Count = 0))

            Return out

        End Function

        Private Function GetSearchCriteria(searchModel As SearchRequestModel) As Expression(Of Func(Of Task, Boolean))

            Dim criteria As Expression(Of Func(Of Task, Boolean))

            If String.IsNullOrEmpty(searchModel.SearchTerm) Then
                criteria = Function(x) True
            Else
                criteria = Function(x) x.Project.ProjectMembers.Any(Function(y) y.UserId = CurrentUserId) AndAlso
                           (x.Title.Contains(searchModel.SearchTerm) OrElse
                           x.Project.Description.Contains(searchModel.SearchTerm) OrElse
                           x.UserStory.Title.Contains(searchModel.SearchTerm) OrElse
                           x.UserStory.Description.Contains(searchModel.SearchTerm) OrElse
                           x.Project.Title.Contains(searchModel.SearchTerm) OrElse
                           x.Project.Url.Contains(searchModel.SearchTerm) OrElse
                           x.Project.CodeName.Contains(searchModel.SearchTerm) OrElse
                           x.Project.Description.Contains(searchModel.SearchTerm))
            End If

            Return criteria

        End Function

#End Region

#Region " CRUD "

        Public Function AddSupport(data As DtoTask) As ResponseModel

            'Id should be zero
            If data.TaskId <> 0 Then
                ResponseModel.Create(HttpStatusCode.BadRequest)
            End If

            If data.Members Is Nothing OrElse data.Members.Count = 0 OrElse Not data.Members.Contains(CurrentUserId) Then
                data.Members = New List(Of Integer)({CurrentUserId})
            End If

            data.Score = TaskScores.Good

            Dim task As New Task
            data.FillTask(task)
            task.Archived = True
            task.Status = TaskStatuses.Done
            task.RealEndDate = data.DueDate
            task.StartDate = data.DueDate.Date
            task.Description = String.Empty


            Dim activity As New Activity
            activity.ActivityDate = data.DueDate
            activity.Description = data.Title
            activity.Duration = data.EstimatedDuration
            task.Activities.Add(activity)

            Me.TaskRepository.Add(task)
            Me.TaskRepository.Commit()

            Me.Logger.Log(task, TaskActions.Add)
            Me.Logger.Log(activity, ActivityActions.Add)

            Return ResponseModel.Create(HttpStatusCode.Created)

        End Function

        Public Function Add(data As DtoTask) As ResponseModel

            'Id should be zero
            If data.TaskId <> 0 Then
                ResponseModel.Create(HttpStatusCode.BadRequest)
            End If

            data.Score = TaskScores.Good

            For Each title In data.Title.Split({"."}, StringSplitOptions.RemoveEmptyEntries)

                If String.IsNullOrWhiteSpace(title) Then
                    Continue For
                End If

                Dim task As New Task
                data.FillTask(task)
                task.Title = title
                Me.TaskRepository.Add(task)
                Me.Logger.Log(task, TaskActions.Add)

            Next

            Me.TaskRepository.Commit()

            Return ResponseModel.Create(HttpStatusCode.Created)

        End Function

        Public Function Update(data As DtoTask) As ResponseModel

            Dim task = (From p In GetAvailableQuery() Where p.TaskId = data.TaskId).SingleOrDefault

            If task Is Nothing Then
                Return ResponseModel.Create(HttpStatusCode.NotFound)
            End If

            For Each item In task.TaskMembers.ToList
                Me.TaskMembersRepository.Remove(item.TaskMemberId)
            Next
            task.TaskMembers.Clear()

            data.FillTask(task)

            Me.TaskRepository.Update(task)
            Me.TaskRepository.Commit()

            Me.Logger.Log(task, TaskActions.Update)

            Return ResponseModel.Create(HttpStatusCode.NoContent)

        End Function

        Public Function UpdateStatuses(data As DtoTaskStatusUpdate) As ResponseModel

            If data.TaskIds Is Nothing OrElse data.TaskIds.Count = 0 Then
                Return ResponseModel.Create(HttpStatusCode.NotFound)
            End If

            Dim tasks = (From p In GetAvailableQuery() Where data.TaskIds.Contains(p.TaskId)).ToList
            Dim isThereAnyChange As Boolean = False

            For Each task In tasks
                If task.Status <> data.Status Then

                    isThereAnyChange = True
                    task.Status = data.Status
                    Me.TaskRepository.Update(task)
                    Me.Logger.Log(task, TaskActions.StatusChanged)

                Else
                'Return ResponseModel.Create(HttpStatusCode.Forbidden, Nothing, String.Format("Task with Activity can not change to {0} Status", [Enum].GetName(GetType(TaskStatuses), TaskStatuses.Pending)))
                End If
            Next

            If isThereAnyChange Then
                Me.TaskRepository.Commit()
            End If

            Return ResponseModel.Create(HttpStatusCode.NoContent)

        End Function

        Public Function Archive(data As DtoTaskArchive) As ResponseModel

            If Not data.RealEndDate.HasValue Then
                data.RealEndDate = Now.Date
            End If

            Dim task = (From p In GetAvailableQuery() Where data.TaskId = p.TaskId AndAlso p.Archived = False AndAlso p.Status = TaskStatuses.Done _
                        AndAlso p.Project.ProjectMembers.Any(Function(x) x.MembershipType = ProjectMembershipTypes.Manager AndAlso x.UserId = CurrentUserId)).SingleOrDefault

            If task Is Nothing Then
                Return ResponseModel.Create(HttpStatusCode.NotFound)
            End If

            task.RealEndDate = data.RealEndDate
            task.Archived = True

            Me.Logger.Log(task, TaskActions.Archived)
            Me.TaskRepository.Commit()

            Return ResponseModel.Create(HttpStatusCode.NoContent)

        End Function

#End Region

#Region " Report "

        Public Function GetMyBoard(searchTerm As String) As SearchResponseModel


            Dim query = (From p In GetAvailableQuery()
                         Where p.Archived = False _
                         AndAlso p.StartDate <= DateTime.Now
                         Order By p.Priority Descending, p.DueDate Descending)

            Dim searchModel As New SearchRequestModel With {.SearchTerm = searchTerm}
            Dim criteria = GetSearchCriteria(searchModel)
            Dim totalItems As Integer = 0

            Dim data = Me.TaskRepository.Search(query, criteria, searchModel.SortFields,
                                                searchModel.SortDirections, searchModel.PageSize,
                                                searchModel.PageNumber, totalItems).ToList

            Dim out = New DtoTasks(data)

            Return SearchResponseModel.Create(HttpStatusCode.OK, totalItems, out)

        End Function

        Public Function GetAll(searchTerm As String) As ResponseModel

            Dim query = From p In GetAvailableQuery() Order By p.Priority Descending, p.DueDate Descending

            Dim searchModel As New SearchRequestModel With {.SearchTerm = searchTerm}
            Dim criteria = GetSearchCriteria(searchModel)
            Dim totalItems As Integer = 0

            Dim data = Me.TaskRepository.Search(query, criteria, searchModel.SortFields,
                                                searchModel.SortDirections, searchModel.PageSize,
                                                searchModel.PageNumber, totalItems).ToList

            Dim out = New DtoTasks(data)

            Return SearchResponseModel.Create(HttpStatusCode.OK, totalItems, out)

        End Function

        Public Function GetForArchive() As ResponseModel

            Dim data = GetAvailableQuery.Where(Function(x) x.Archived = False AndAlso x.Status = TaskStatuses.Done _
                                               AndAlso x.Project.ProjectMembers.Any(Function(c) c.UserId = CurrentUserId _
                                                                                    AndAlso c.MembershipType = ProjectMembershipTypes.Manager)).ToList

            Dim out = New DtoTasks(data)
            Return ResponseModel.Create(HttpStatusCode.OK, out)

        End Function

        Public Function GetByProject(id As Integer) As ResponseModel

            Dim data = (From p In GetAvailableQuery()
                        Where p.ProjectId = id).ToList

            Dim out = (From p In (New DtoTasks(data)) Order By p.StartDate).ToList

            Return ResponseModel.Create(HttpStatusCode.OK, out)

        End Function

        Public Function GetById(ByVal id As Integer) As ResponseModel

            Dim data = (From p In GetAvailableQuery()
                        Where p.TaskId = id AndAlso p.Project.ProjectMembers.Any(Function(x) x.UserId = CurrentUserId)).SingleOrDefault

            If data Is Nothing Then
                Return ResponseModel.Create(HttpStatusCode.NotFound)
            End If

            Dim out = DtoTask.CreateInstance(data)
            Return ResponseModel.Create(HttpStatusCode.OK, out)

        End Function

        Public Function GetByUserStory(id As Integer) As ResponseModel

            Dim data = (From p In GetAvailableQuery()
                        Where p.UserStoryId = id).ToList

            Dim out = New DtoTasks(data)
            Return ResponseModel.Create(HttpStatusCode.OK, out)

        End Function

#End Region

    End Class

End Namespace