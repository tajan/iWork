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

    Public Class ActivityController
        Inherits BaseController

#Region " Private Members "

        Private Function GetAvailableViewList(Optional criteria As Expression(Of Func(Of Activity, Boolean)) = Nothing) As List(Of DtoActivity)

            Dim query = From p In Me.ActivityRepository.GetAll.Include(Function(x) x.Task)

            If criteria IsNot Nothing Then
                query = query.Where(criteria)
            End If

            Dim out = (From p In query
                       Join q In Me.ActionLogRepository.GetAll.Include(Function(x) x.User) On p.ActivityId Equals q.EntityId
                       Where q.EntityTypeId = EntityTypes.Activity AndAlso q.ActionTypeId = ActivityActions.Add
                       Order By p.ActivityDate Descending
                       Select New With {.ActionLog = q, .Activity = p, .User = q.User, .Task = p.Task, .Project = p.Task.Project}).ToList.Select(Function(x) New DtoActivity(x.Activity, x.Task, x.Project, x.ActionLog, x.User)).ToList

            Return out

        End Function

        Private Function GetAvailableQuery() As IQueryable(Of Activity)

            Dim out = (From p In Me.ActivityRepository.GetAll.Include(Function(x) x.Task)
                       Join q In Me.ActionLogRepository.GetAll.Include(Function(x) x.User) On p.ActivityId Equals q.EntityId
                        Where q.EntityTypeId = EntityTypes.Activity AndAlso q.ActionTypeId = ActivityActions.Add
                       Order By p.ActivityDate Descending
                       Select p)

            Return out

        End Function

#End Region

#Region " CRUD "

        Public Function Add(data As DtoActivity) As ResponseModel

            'Id should be zero
            If data.ActivityId <> 0 Then
                ResponseModel.Create(HttpStatusCode.BadRequest)
            End If

            'TODO : Check if there is any other way to get task Status
            Dim Task = TaskRepository.GetById(data.TaskId)
            If Task.Status = TaskStatuses.Pending Then
                Return ResponseModel.Create(HttpStatusCode.NotAcceptable, Nothing, String.Format("Activity can not be add for the task that has Pending status"))
            End If

            Dim activity As New Activity
            data.FillActivity(activity)

            Me.ActivityRepository.Add(activity)
            Me.ActivityRepository.Commit()

            Me.Logger.Log(activity, ActivityActions.Add)

            Dim criteria As Expression(Of Func(Of Activity, Boolean)) = Function(x) x.ActivityId = activity.ActivityId


            Dim k = (From p In Me.ActionLogRepository.GetAll Where p.EntityTypeId = EntityTypes.Activity And p.EntityId = activity.ActivityId).ToList
            Dim k1 = (From p In Me.ActivityRepository.GetAll Where p.ActivityId = activity.ActivityId).ToList

            Dim out = GetAvailableViewList(criteria).FirstOrDefault
            Return ResponseModel.Create(HttpStatusCode.OK, out)

        End Function


        Public Function Remove(id As Integer) As ResponseModel

            Dim activity As Activity = (From p In GetAvailableQuery() Where p.ActivityId = id).SingleOrDefault

            If activity Is Nothing Then
                Return ResponseModel.Create(HttpStatusCode.NotFound)
            End If

            Me.ActivityRepository.Remove(id)
            Me.ActivityRepository.Commit()

            Me.Logger.Log(activity, ActivityActions.Remove)

            Return ResponseModel.Create(HttpStatusCode.NoContent)

        End Function

        Public Function Update(data As DtoActivity) As ResponseModel


            Dim activity As Activity = (From p In Me.ActivityRepository.GetAll
                                       Join q In Me.ActionLogRepository.GetAll.Include(Function(x) x.User) On p.ActivityId Equals q.EntityId
                                        Where q.EntityTypeId = EntityTypes.Activity AndAlso q.ActionTypeId = ActivityActions.Add _
                                        AndAlso q.UserId = CurrentUserId
                                        Where p.ActivityId = data.ActivityId
                                        Select p).SingleOrDefault

            If activity Is Nothing Then
                Return ResponseModel.Create(HttpStatusCode.NotFound)
            End If

            data.FillActivity(activity)

            Me.ActivityRepository.Update(activity)
            Me.ActivityRepository.Commit()

            Me.Logger.Log(activity, ActivityActions.Update)

            Return ResponseModel.Create(HttpStatusCode.NoContent)

        End Function

#End Region

#Region " Report "

        Public Function GetByTask(id As Integer) As ResponseModel

            Dim criteria As Expression(Of Func(Of Activity, Boolean)) = Function(x) x.TaskId = id
            Return ResponseModel.Create(HttpStatusCode.OK, GetAvailableViewList(criteria))

        End Function

        Public Function GetById(ByVal id As Integer) As ResponseModel

            Dim criteria As Expression(Of Func(Of Activity, Boolean)) = Function(x) x.ActivityId = id
            Return ResponseModel.Create(HttpStatusCode.OK, GetAvailableViewList(criteria))

        End Function

        Public Function Search(data As DtoActivitySearch) As ResponseModel

            If data.ToDate.HasValue Then
                data.ToDate = data.ToDate.Value.AddDays(1).Date
            End If

            If data.FromDate.HasValue Then
                data.FromDate = data.FromDate.Value.Date
            End If

            Dim criteria As Expression(Of Func(Of Activity, Boolean)) = Function(x) (Not data.FromDate.HasValue OrElse x.ActivityDate >= data.FromDate.Value) AndAlso
                                                                            (Not data.ToDate.HasValue OrElse x.ActivityDate < data.ToDate.Value)

            Return ResponseModel.Create(HttpStatusCode.OK, GetAvailableViewList(criteria).Where(Function(x) x.User.UserId = CurrentUserId))

        End Function

#End Region

    End Class

End Namespace


