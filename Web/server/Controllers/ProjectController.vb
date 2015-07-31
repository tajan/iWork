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

    Public Class ProjectController
        Inherits BaseController

#Region " Private Members "

        Private Function GetAvailableQuery(Optional criteria As Expression(Of Func(Of Project, Boolean)) = Nothing) As IQueryable(Of Project)

            'applying security
            Dim query = From p In Me.ProjectRepository.GetAll
                        Where (p.ProjectMembers.Any(Function(x) x.UserId = CurrentUserId))

            'applying filter
            If criteria IsNot Nothing Then
                query = From p In query.Where(criteria)
            End If

            'including files
            query = From p In query.Include(Function(x) x.ProjectFiles).Include("ProjectFiles.File")

            'including members
            query = From p In query.Include(Function(x) x.ProjectMembers).Include("ProjectMembers.User")

            'including sprints
            query = From p In query.Include(Function(x) x.Sprints)

            'including user stories
            query = From p In query.Include(Function(x) x.UserStories)

            'including workflows
            query = From p In query.Include(Function(x) x.ProjectWorkflows)


            Return query

        End Function

        Private Function GetAvailableDto(Optional criteria As Expression(Of Func(Of Project, Boolean)) = Nothing) As List(Of DtoProject)

            Return New DtoProjects(GetAvailableQuery(criteria).ToList)

        End Function

        Private Function GetSearchCriteria(searchModel As SearchRequestModel) As Expression(Of Func(Of Project, Boolean))

            Dim criteria As Expression(Of Func(Of Project, Boolean))

            If String.IsNullOrEmpty(searchModel.SearchTerm) Then
                criteria = Function(x) True
            Else
                criteria = Function(x) x.Title.Contains(searchModel.SearchTerm) OrElse
               x.Description.Contains(searchModel.SearchTerm) OrElse
               x.Url.Contains(searchModel.SearchTerm) OrElse
               x.CodeName.Contains(searchModel.SearchTerm)
            End If

            Return criteria

        End Function

#End Region

#Region " CRUD "

        Public Function Add(data As DtoProject) As ResponseModel

            'Id should be zero
            If data.ProjectId <> 0 Then
                ResponseModel.Create(HttpStatusCode.BadRequest)
            End If

            Dim project As New Project
            data.FillProject(project)

            Me.ProjectRepository.Add(project)
            Me.ProjectRepository.Commit()

            Me.Logger.Log(project, ProjectActions.Add)

            Return ResponseModel.Create(HttpStatusCode.Created)

        End Function

        Public Function Update(data As DtoProject) As ResponseModel

            Dim criteria As Expression(Of Func(Of Project, Boolean)) = Function(x) x.ProjectId = data.ProjectId
            Dim project As Project = (From p In GetAvailableQuery(criteria)).SingleOrDefault

            If project Is Nothing Then
                Return ResponseModel.Create(HttpStatusCode.NotFound)
            End If

            For Each item In project.ProjectMembers.ToList
                Me.ProjectMembersRepository.Remove(item.ProjectMemebrId)
            Next
            project.ProjectMembers.Clear()

            'todo: think about workflow later
            data.Workflows.Clear()
            data.FillProject(project)

            Me.ProjectRepository.Update(project)
            Me.ProjectRepository.Commit()

            Me.Logger.Log(project, ProjectActions.Update)

            Return ResponseModel.Create(HttpStatusCode.NoContent)

        End Function

#End Region

#Region " Report "

        Public Function GetById(id As Integer) As ResponseModel

            Dim data = (From p In GetAvailableQuery() Where p.ProjectId = id).SingleOrDefault

            If data Is Nothing Then
                Return ResponseModel.Create(HttpStatusCode.NotFound)
            End If

            Dim out = DtoProject.CreateInstance(data)
            Return ResponseModel.Create(HttpStatusCode.OK, out)

        End Function

        Public Function GetAll(searchTerm As String) As SearchResponseModel

            Dim query = From p In GetAvailableQuery() Order By p.CodeName
            Dim searchModel As New SearchRequestModel With {.SearchTerm = searchTerm}

            Dim criteria = GetSearchCriteria(searchModel)
            Dim totalItems As Integer = 0

            Dim data = Me.ProjectRepository.Search(query, criteria, searchModel.SortFields,
                                                searchModel.SortDirections, searchModel.PageSize,
                                                searchModel.PageNumber, totalItems).ToList

            Dim out = New DtoProjects(data)

            Return SearchResponseModel.Create(HttpStatusCode.OK, totalItems, out)

        End Function

        Public Function GetAllMinimal() As ResponseModel
            Dim data = From p In GetAvailableQuery()
                       Select New With {.ProjectId = p.ProjectId, .Description = p.CodeName & " - " & p.Url, .Title = p.Title}

            Return ResponseModel.Create(HttpStatusCode.OK, data.tolist)
        End Function


#End Region

    End Class

End Namespace