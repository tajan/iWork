Imports System.Web.Http
Imports Web.Repositories
Imports Web.Repositories.EF

Namespace Controllers

    <Authorize>
    Public Class BaseController
        Inherits ApiController

        Public ReadOnly Property CurrentUserId As Integer
            Get
                Return Application.GetCurrentUserId
            End Get
        End Property

        Public Property ProjectRepository As IGenericRepository(Of Project, Integer)
        Public Property ProjectFilesRepository As IGenericRepository(Of ProjectFile, Integer)
        Public Property ProjectMembersRepository As IGenericRepository(Of ProjectMember, Integer)
        Public Property SprintRepository As IGenericRepository(Of Sprint, Integer)
        Public Property UserStoryRepository As IGenericRepository(Of UserStory, Integer)
        Public Property TaskRepository As IGenericRepository(Of Task, Integer)
        Public Property TaskMembersRepository As IGenericRepository(Of TaskMember, Integer)
        Public Property FileRepository As IGenericRepository(Of File, Integer)
        Public Property ActivityRepository As IGenericRepository(Of Activity, Integer)
        Public Property ActionLogRepository As IGenericRepository(Of ActionLog, Integer)
        Public Property UserRepository As IGenericRepository(Of User, Integer)
        Public Property Logger As Logger

        Public Sub New()

            Dim dbcontext As New iWorkContext
            ProjectRepository = New GenericRepository(Of Project, Integer)(dbcontext)
            ProjectFilesRepository = New GenericRepository(Of ProjectFile, Integer)(dbcontext)
            ProjectMembersRepository = New GenericRepository(Of ProjectMember, Integer)(dbcontext)
            SprintRepository = New GenericRepository(Of Sprint, Integer)(dbcontext)
            UserStoryRepository = New GenericRepository(Of UserStory, Integer)(dbcontext)
            TaskRepository = New GenericRepository(Of Task, Integer)(dbcontext)
            TaskMembersRepository = New GenericRepository(Of TaskMember, Integer)(dbcontext)
            FileRepository = New GenericRepository(Of File, Integer)(dbcontext)
            ActivityRepository = New GenericRepository(Of Activity, Integer)(dbcontext)
            ActionLogRepository = New GenericRepository(Of ActionLog, Integer)(dbcontext)
            UserRepository = New GenericRepository(Of User, Integer)(dbcontext)
            Logger = New Logger(dbcontext)

        End Sub

    End Class

End Namespace

