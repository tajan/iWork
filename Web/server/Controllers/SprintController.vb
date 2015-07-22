Imports System.Net
Imports System.Net.Http
Imports System.Web.Http
Imports Web.Repositories.EF
Imports Microsoft.Owin
Imports Microsoft.AspNet.Identity.Owin
Imports Microsoft.AspNet.Identity

Namespace Controllers

    Public Class SprintController
        Inherits BaseController

#Region " Private Members "

        Private Function GetAvailableQuery() As IQueryable(Of Sprint)

            Dim out = (From p In Me.SprintRepository.GetAll
                       Where p.Project.ProjectMembers.Any(Function(x) x.UserId = CurrentUserId))

            Return out

        End Function

#End Region

#Region " CRUD "

        Public Function Add(data As DtoSprint) As ResponseModel

            'Id should be zero
            If data.SprintId <> 0 Then
                ResponseModel.Create(HttpStatusCode.BadRequest)
            End If

            Dim sprint As New Sprint
            data.FillSprint(sprint)

            Me.SprintRepository.Add(sprint)
            Me.SprintRepository.Commit()

            Me.Logger.Log(sprint, SprintActions.Add)

            Return ResponseModel.Create(HttpStatusCode.Created)

        End Function

        Public Function Update(data As DtoSprint) As ResponseModel

            Dim sprint As Sprint = (From p In GetAvailableQuery() Where p.SprintId = data.SprintId).SingleOrDefault

            If sprint Is Nothing Then
                Return ResponseModel.Create(HttpStatusCode.NotFound)
            End If

            Me.SprintRepository.Update(sprint)
            Me.SprintRepository.Commit()

            Me.Logger.Log(sprint, SprintActions.Update)

            Return ResponseModel.Create(HttpStatusCode.NoContent)

        End Function


#End Region

#Region " Report "

        Public Function GetByProject(id As Integer) As ResponseModel

            Dim data = (From p In GetAvailableQuery()
                       Where p.ProjectId = id).ToList

            Dim out As New DtoSprints(data)

            Return ResponseModel.Create(HttpStatusCode.OK, out)

        End Function

        Public Function GetById(ByVal id As Integer) As ResponseModel

            Dim data = (From p In GetAvailableQuery()
                      Where p.SprintId = id).SingleOrDefault

            If data Is Nothing Then
                ResponseModel.Create(HttpStatusCode.NotFound)
            End If

            Dim out = DtoSprint.CreateInstance(data)

            Return ResponseModel.Create(HttpStatusCode.OK, out)

        End Function

#End Region

    End Class

End Namespace

