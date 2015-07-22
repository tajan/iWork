Imports System.Net
Imports System.Net.Http
Imports System.Web.Http
Imports Web.Repositories.EF
Imports Microsoft.Owin
Imports Microsoft.AspNet.Identity.Owin
Imports Microsoft.AspNet.Identity
Imports System.Data.Entity

Namespace Controllers

    Public Class UserStoryController
        Inherits BaseController

#Region " Private Members "

        Private Function GetAvailableQuery() As IQueryable(Of UserStory)

            Dim out = (From p In Me.UserStoryRepository.GetAll
                       Where p.Project.ProjectMembers.Any(Function(x) x.UserId = CurrentUserId))

            Return out

        End Function

#End Region

#Region " CRUD "

        Public Function Add(data As DtoUserStory) As ResponseModel

            'Id should be zero
            If data.UserStoryId <> 0 Then
                ResponseModel.Create(HttpStatusCode.BadRequest)
            End If

            Dim userStory As New UserStory
            data.FillUserStory(userStory)

            Me.UserStoryRepository.Add(userStory)
            Me.UserStoryRepository.Commit()

            Me.Logger.Log(userStory, ProjectActions.Add)

            Return ResponseModel.Create(HttpStatusCode.Created)


        End Function

        Public Function Update(data As DtoUserStory) As ResponseModel

            Dim userStory = (From p In GetAvailableQuery() Where p.UserStoryId = data.UserStoryId).SingleOrDefault

            If userStory Is Nothing Then
                Return ResponseModel.Create(HttpStatusCode.NotFound)
            End If

            data.FillUserStory(userStory)

            Me.UserStoryRepository.Update(userStory)
            Me.UserStoryRepository.Commit()

            Me.Logger.Log(userStory, ProjectActions.Update)

            Return ResponseModel.Create(HttpStatusCode.NoContent)

        End Function

#End Region

#Region " Report "

        Public Function GetByProject(id As Integer) As ResponseModel

            Dim data = (From p In Me.UserStoryRepository.GetAll.Include(Function(x) x.Sprint).Include(Function(x) x.UserStoryFiles).Include("UserStoryFiles.File")
                       Where p.ProjectId = id AndAlso
                       p.Project.ProjectMembers.Any(Function(x) x.UserId = CurrentUserId)).ToList

            Dim out = New DtoUserStories(data)
            Return ResponseModel.Create(HttpStatusCode.OK, out)

        End Function

        Public Function GetById(ByVal id As Integer) As ResponseModel

            Dim data = (From p In Me.UserStoryRepository.GetAll.Include(Function(x) x.Sprint).Include(Function(x) x.UserStoryFiles).Include("UserStoryFiles.File")
                       Where p.UserStoryId = id AndAlso p.Project.ProjectMembers.Any(Function(x) x.UserId = CurrentUserId)).SingleOrDefault

            If data Is Nothing Then
                Return ResponseModel.Create(HttpStatusCode.NotFound)
            End If

            Dim out = DtoUserStory.CreateInstance(data)
            Return ResponseModel.Create(HttpStatusCode.OK, out)

        End Function

        Public Function GetAllMinimal(id As Integer) As ResponseModel

            Dim data = From p In GetAvailableQuery()
                       Where p.ProjectId = id
                       Select New With {
                           .UserStoryId = p.UserStoryId,
                           .Description = p.Description,
                           .Title = p.Title}

            Return ResponseModel.Create(HttpStatusCode.OK, data.ToList)

        End Function

#End Region
        
    End Class

End Namespace