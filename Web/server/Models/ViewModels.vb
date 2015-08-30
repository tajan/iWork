#Region " File "

Public Class DtoFile
    Public Property Name As String
    Public Property Guid As String

    Public Property EntityType As EntityTypes

    Public Shared Function CreateInstance(file As File, entityType As EntityTypes) As DtoFile
        Dim out As New DtoFile

        With out
            .Name = file.Name
            .Guid = file.Guid
            .EntityType = entityType
        End With

        Return out
    End Function

End Class

#End Region

#Region " User "

Public Class DtoUser
    Public Property Fullname As String
    Public Property DisplayName As String
    Public Property Email As String
    Public Property SecondaryEmail As String
    Public Property Phone As String
    Public Property Home As String
    Public Property Mobile As String
    Public Property Username As String
    Public Property UserId As Integer
    Public Property Picture As DtoFile
    Public Property PictureFileId As Integer?

    Public Shared Function CreateInstance(user As User) As DtoUser

        Dim out As New DtoUser

        With out
            .DisplayName = user.DisplayName
            .Home = user.Home
            .Mobile = user.Mobile
            .Phone = user.PhoneNumber
            .SecondaryEmail = user.SecondaryEmail
            .Username = user.UserName
            .Fullname = user.FullName
            .Email = user.Email
            .UserId = user.Id
            If user.File IsNot Nothing Then
                .Picture = DtoFile.CreateInstance(user.File, EntityTypes.User)
                .PictureFileId = user.File.FileId
            End If

        End With

        Return out

    End Function

    Public Sub FillUser(user As User)

        With user

            .DisplayName = DisplayName
            .Home = Home
            .Mobile = Mobile
            .PhoneNumber = Phone
            .SecondaryEmail = SecondaryEmail
            .UserName = Username
            .FullName = Fullname
            .Email = Email
            .Id = UserId

            If PictureFileId.HasValue Then
                .PictureFileId = PictureFileId.Value
            End If

        End With

    End Sub

End Class

Public Class DtoUsers
    Inherits List(Of DtoUser)

    Public Sub New()
    End Sub

    Public Sub New(users As IEnumerable(Of User))

        For Each user In users
            Me.Add(DtoUser.CreateInstance(user))
        Next

    End Sub

End Class

Public Class DtoUserMinimal
    Public Property DisplayName As String
    Public Property Email As String
    Public Property UserId As Integer

    Public Shared Function CreateInstance(user As User) As DtoUserMinimal
        Dim out As New DtoUserMinimal

        With out
            .DisplayName = user.DisplayName
            .Email = user.Email
            .UserId = user.Id
        End With

        Return out

    End Function

End Class

Public Class DtoUsersMinimal
    Inherits List(Of DtoUserMinimal)

    Public Sub New()
    End Sub

    Public Sub New(users As IEnumerable(Of User))

        For Each user In users
            Me.Add(DtoUserMinimal.CreateInstance(user))
        Next

    End Sub

End Class

#End Region

#Region " Activity "

Public Class DtoActivities
    Inherits List(Of DtoActivity)

    Public Sub New()
    End Sub

    Public Sub New(activities As IEnumerable(Of Activity))

        For Each activity In activities
            Me.Add(DtoActivity.CreateInstance(activity))
        Next

    End Sub

End Class

Public Class DtoActivity
    Public Property ActivityId As Integer
    Public Property Description As String
    Public Property TaskId As Integer
    Public Property Duration As Integer
    Public Property ActivityDateTime As DateTime
    Public Property ActivityDate As Date
    Public Property User As DtoUser
    Public Property CreateDate As DateTime
    Public Property TaskTitle As String
    Public Property ProjectTitle As String
    Public Property ProjectCodeName As String
    Public Property ProjectId As Integer


    Public Sub New()

    End Sub

    Public Sub New(activity As Activity, actionlog As ActionLog, user As User)

        With Me
            .ActivityId = activity.ActivityId
            .TaskId = activity.TaskId
            .Description = activity.Description
            .Duration = activity.Duration
            .User = DtoUser.CreateInstance(user)
            .CreateDate = actionlog.ActionDate
            .ActivityDateTime = activity.ActivityDate
            .ActivityDate = activity.ActivityDate.Date
            '.TaskTitle = activity.Task.Title
            '.ProjectCodeName = activity.Task.Project.CodeName
            '.ProjectTitle = activity.Task.Project.Title
            '.ProjectId = activity.Task.ProjectId
        End With

    End Sub

    Public Shared Function CreateInstance(activity As Activity) As DtoActivity

        Dim out As New DtoActivity
        With out
            .ActivityId = activity.ActivityId
            .TaskId = activity.TaskId
            .Description = activity.Description
            .Duration = activity.Duration
            .ActivityDateTime = activity.ActivityDate
            .ActivityDate = activity.ActivityDate.Date
            .TaskTitle = activity.Task.Title
            .ProjectCodeName = activity.Task.Project.CodeName
            .ProjectTitle = activity.Task.Project.Title
            .ProjectId = activity.Task.ProjectId
        End With

        Return out

    End Function

    Public Sub FillActivity(activity As Activity)

        With activity
            .TaskId = TaskId
            .Description = Description
            .Duration = Duration
            .ActivityDate = ActivityDateTime
        End With

    End Sub

End Class

Partial Public Class Activity

    Public Property ActionLog As ActionLog

    Public Sub New()

    End Sub
    Public Sub New(actionlog As ActionLog)
        Me.ActionLog = actionlog
    End Sub

End Class

Public Class DtoActivitySearch

    Public Property FromDate As DateTime?
    Public Property ToDate As DateTime?

End Class

#End Region

#Region " Task "

Public Class DtoTaskStatusUpdate

    Public Property TaskIds As List(Of Integer)
    Public Property Status As Integer

End Class

Public Class DtoTasks
    Inherits List(Of DtoTask)

    Public Sub New(tasks As IEnumerable(Of Task))

        For Each task In tasks
            Me.Add(DtoTask.CreateInstance(task))
        Next

    End Sub

End Class

Public Class DtoTask
    Public Property TaskId As Integer
    Public Property UserStoryId As Integer?
    Public Property UserStoryTitle As String
    Public Property UserStoryStatus As Integer
    Public Property ProjectId As Integer
    Public Property ProjectTitle As String
    Public Property ProjectCodeName As String
    Public Property ProjectStyle As String
    Public Property Title As String
    Public Property Description As String
    Public Property Status As Integer
    Public Property Members As List(Of Integer)
    Public Property MembersList As List(Of DtoUser)
    Public Property EstimatedDuration As Integer
    Public Property ActivityDuration As Integer
    Public Property ActivityCount As Integer
    Public Property DueDate As DateTime
    Public Property Progress As Integer
    Public Property MembersCount As Integer
    Public Property Score As TaskScores
    Public Property Priority As TaskPriorities
    Public Property Files As String
    Public Property FilesList As List(Of DtoFile)
    Public Property RealEndDate As Date?
    Public Property Type As TaskTypes = TaskTypes.Generic
    Public Property StartDate As DateTime
    Public Property CreatorName As String
    Public Shared Function CreateInstance(task As Task) As DtoTask

        Dim out As New DtoTask
        With out
            .TaskId = task.TaskId
            .Title = task.Title
            .Description = task.Description
            .Status = task.Status
            .ProjectTitle = task.Project.Title
            .ProjectId = task.Project.ProjectId
            .MembersList = task.TaskMembers.Select(Function(x) DtoUser.CreateInstance(x.User)).ToList
            .Members = task.TaskMembers.Select(Function(x) x.UserId).ToList
            .ProjectStyle = task.Project.Style
            .ProjectCodeName = task.Project.CodeName
            .ActivityCount = task.Activities.Count
            .ActivityDuration = task.Activities.Sum(Function(x) x.Duration)
            .EstimatedDuration = task.EstimatedDuartion
            .StartDate = task.StartDate
            .DueDate = task.DueDate
            .MembersCount = .Members.Count
            .Score = task.Score
            .Priority = task.Priority
            .RealEndDate = task.RealEndDate
            .Type = task.Type

            .FilesList = New List(Of DtoFile)
            task.TaskFiles.ToList.ForEach(Sub(x)
                                              out.FilesList.Add(DtoFile.CreateInstance(x.File, EntityTypes.Task))
                                          End Sub)


            Dim firstActivity = (From p In task.Activities Order By p.ActivityDate).FirstOrDefault
            If firstActivity Is Nothing Then
                .StartDate = task.DueDate.AddDays(-1 * CInt(task.EstimatedDuartion / 6) - 1)
            Else
                .StartDate = firstActivity.ActivityDate
            End If


            If task.UserStory IsNot Nothing Then
                .UserStoryId = task.UserStoryId
                .UserStoryStatus = task.UserStory.Status
                .UserStoryTitle = task.UserStory.Title
            End If


        End With

        Dim prog As Integer = 0

        If out.EstimatedDuration > 0 Then
            prog = CInt(out.ActivityDuration * 100 / out.EstimatedDuration)
        End If

        If prog > 100 Then
            prog = 100
        End If

        out.Progress = prog

        Return out

    End Function

    Public Sub FillTask(task As Task)

        With task
            .TaskId = TaskId
            .Description = Description
            .Title = Title
            .Status = Status
            .ProjectId = ProjectId
            .UserStoryId = UserStoryId
            .EstimatedDuartion = EstimatedDuration
            .DueDate = DueDate
            .StartDate = StartDate.Date
            .Score = Score
            .Priority = Priority
            .RealEndDate = RealEndDate
            .Type = Type

            Members.ForEach(Sub(userid)
                                .TaskMembers.Add(New TaskMember With {.TaskId = TaskId,
                                                                      .Task = task,
                                                                      .UserId = userid})
                            End Sub)

            If Not String.IsNullOrEmpty(Files) Then
                .TaskFiles = New List(Of TaskFile)
                Files.Split({","}, StringSplitOptions.RemoveEmptyEntries).ToList.ForEach(Sub(fileId)
                                                                                             .TaskFiles.Add(New TaskFile With {.FileId = fileId})
                                                                                         End Sub)
            End If

        End With

    End Sub

End Class

Public Class DtoTaskArchive

    Public Property RealEndDate As Date?
    Public Property TaskId As Integer

End Class

#End Region

#Region " Projects "

Public Class DtoProjects
    Inherits List(Of DtoProject)

    Public Sub New(projects As IEnumerable(Of Project))

        For Each project In projects
            Me.Add(DtoProject.CreateInstance(project))
        Next

    End Sub

End Class

Public Class DtoProject
    Public Property ProjectId As Integer
    Public Property Title As String
    Public Property Url As String
    Public Property CodeName As String
    Public Property Customer As String
    Public Property Description As String
    Public Property EstimatedHours As Integer
    Public Property Score As Integer
    Public Property StartDate As DateTime
    Public Property EndDate As DateTime
    Public Property Managers As List(Of Integer)
    Public Property ManagersList As List(Of DtoUser)
    Public Property MembersList As List(Of DtoUser)
    Public Property Members As List(Of Integer)
    Public Property Files As String
    Public Property FilesList As List(Of DtoFile)
    Public Property Status As Integer
    Public Property Style As String
    Public Property Workflows As List(Of String)
    Public Property MembersCount As Integer
    Public Property TaskCount As Integer
    Public Property ActivityCount As Integer
    Public Property UserStoryCount As Integer
    'Public Property TasksByStatus As List(Of DtoLabelValue)
    Public Property UserStoriesByStatus As List(Of DtoLabelValue)


    Public Sub FillProject(project As Project)

        Dim currentUserId As Integer = Application.GetCurrentUserId

        If Not Managers.Contains(currentUserId) AndAlso project.ProjectId = 0 Then
            Managers.Add(currentUserId)
        End If

        With project

            .Description = Description
            .EndDate = EndDate
            .ProjectId = ProjectId
            .Score = Score
            .EstmatedHours = EstimatedHours
            .StartDate = StartDate
            .Title = Title
            .Url = Url
            .CodeName = CodeName
            .Customer = Customer
            .Status = Status
            .Style = Style

            Managers.ForEach(Sub(userid)
                                 .ProjectMembers.Add(New ProjectMember With {.MembershipType = ProjectMembershipTypes.Manager,
                                                                             .ProjectId = ProjectId,
                                                                             .Project = project,
                                                                             .UserId = userid})
                             End Sub)

            Members.ForEach(Sub(userid)
                                .ProjectMembers.Add(New ProjectMember With {.MembershipType = ProjectMembershipTypes.Member,
                                                                            .ProjectId = ProjectId,
                                                                            .Project = project,
                                                                            .UserId = userid})
                            End Sub)

            'Dim viewOrder As Integer = 0
            'Workflows.ForEach(Sub(workflowName)
            '                      viewOrder += 1
            '                      .ProjectWorkflows.Add(New ProjectWorkflow With {.Title = workflowName,
            '                                                                  .ViewOrder = viewOrder})
            '                  End Sub)


            If Not String.IsNullOrEmpty(Files) Then
                Files.Split({","}, StringSplitOptions.RemoveEmptyEntries).ToList.ForEach(Sub(fileId)
                                                                                             .ProjectFiles.Add(New ProjectFile With {.FileId = fileId,
                                                                                                                                     .Project = project,
                                                                                                                                     .ProjectId = project.ProjectId})
                                                                                         End Sub)
            End If

        End With

    End Sub

    Public Shared Function CreateInstance(project As Project) As DtoProject

        Dim out As New DtoProject

        With project

            out.ProjectId = .ProjectId
            out.Title = .Title
            out.Url = .Url
            out.CodeName = .CodeName
            out.Customer = .Customer
            out.Description = .Description
            out.Score = .Score
            out.EstimatedHours = .EstmatedHours
            out.StartDate = .StartDate
            out.EndDate = .EndDate
            out.ManagersList = .ProjectMembers.Where(Function(x) x.MembershipType = ProjectMembershipTypes.Manager).Select(Function(x) DtoUser.CreateInstance(x.User)).ToList
            out.MembersList = .ProjectMembers.Where(Function(x) x.MembershipType = ProjectMembershipTypes.Member).Select(Function(x) DtoUser.CreateInstance(x.User)).ToList
            out.Managers = .ProjectMembers.Where(Function(x) x.MembershipType = ProjectMembershipTypes.Manager).Select(Function(x) x.UserId).ToList
            out.Members = .ProjectMembers.Where(Function(x) x.MembershipType = ProjectMembershipTypes.Member).Select(Function(x) x.UserId).ToList
            out.FilesList = .ProjectFiles.Select(Function(x) DtoFile.CreateInstance(x.File, EntityTypes.Project)).ToList
            out.Status = .Status
            out.Style = .Style
            out.Workflows = .ProjectWorkflows.Where(Function(x) x.ProjectId = project.ProjectId).Select(Function(x) x.Title).ToList
            out.MembersCount = .ProjectMembers.Count
            out.UserStoryCount = .UserStories.Count

            out.TaskCount = .Tasks.Count
            out.ActivityCount = .Tasks.SelectMany(Function(x) x.Activities).Count


            out.UserStoriesByStatus = New List(Of DtoLabelValue)

            Dim _userStoriesByStatus = (From p In .UserStories Group By p.Status Into Value = Count() Select Value, Status).ToList

            _userStoriesByStatus.ForEach(Sub(x)
                                             Dim status As New DtoLabelValue(x.Status, EnumHelper.UserStoryStatus.GetName(x.Status), x.Value)
                                             out.UserStoriesByStatus.Add(status)
                                         End Sub)


        End With

        Return out

    End Function

End Class

#End Region

#Region " Sprints "

Public Class DtoSprints
    Inherits List(Of DtoSprint)

    Public Sub New(sprints As IEnumerable(Of Sprint))

        For Each sprint In sprints
            Me.Add(DtoSprint.CreateInstance(sprint))
        Next

    End Sub

End Class

Public Class DtoSprint
    Public Property SprintId As Integer
    Public Property Title As String
    Public Property Description As String
    Public Property StartDate As DateTime
    Public Property EndDate As DateTime
    Public Property Status As Integer
    Public Property ProjectId As Integer

    Public Sub FillSprint(sprint As Sprint)

        With sprint

            .Description = Description
            .EndDate = EndDate
            .ProjectId = ProjectId
            .StartDate = StartDate
            .Status = Status
            .Title = Title

        End With

    End Sub

    Public Shared Function CreateInstance(sprint As Sprint) As DtoSprint

        Dim out As New DtoSprint

        With sprint

            out.SprintId = .SprintId
            out.ProjectId = .ProjectId
            out.Title = .Title
            out.Description = .Description
            out.StartDate = .StartDate
            out.EndDate = .EndDate
            out.Status = .Status

        End With

        Return out

    End Function

End Class

#End Region

#Region " User Stories "

Public Class DtoUserStories
    Inherits List(Of DtoUserStory)

    Public Sub New(userStories As IEnumerable(Of UserStory))

        For Each userStory In userStories
            Me.Add(DtoUserStory.CreateInstance(userStory))
        Next

    End Sub

End Class

Public Class DtoUserStory
    Public Property UserStoryId As Integer
    Public Property ProjectId As Integer
    Public Property ProjectTitle As String
    Public Property Title As String
    Public Property Description As String
    Public Property Files As String
    Public Property Status As Integer
    Public Property Score As Integer
    Public Property FilesList As List(Of DtoFile)

    Public Shared Function CreateInstance(userStory As UserStory) As DtoUserStory

        Dim out As New DtoUserStory
        With out
            .Title = userStory.Title
            .Description = userStory.Description
            .UserStoryId = userStory.UserStoryId
            .Status = userStory.Status
            .Score = userStory.Score
            .ProjectTitle = userStory.Project.Title
            .ProjectId = userStory.Project.ProjectId
            .FilesList = New List(Of DtoFile)
            userStory.UserStoryFiles.ToList.ForEach(Sub(x)
                                                        out.FilesList.Add(DtoFile.CreateInstance(x.File, EntityTypes.UserStory))
                                                    End Sub)
        End With

        Return out

    End Function

    Public Sub FillUserStory(userStory As UserStory)


        With userStory

            .Description = Description
            .Title = Title
            .Status = Status
            .Score = Score
            .ProjectId = ProjectId

            If Not String.IsNullOrEmpty(Files) Then
                .UserStoryFiles = New List(Of UserStoryFile)
                Files.Split({","}, StringSplitOptions.RemoveEmptyEntries).ToList.ForEach(Sub(fileId)
                                                                                             .UserStoryFiles.Add(New UserStoryFile With {.FileId = fileId})
                                                                                         End Sub)
            End If

        End With

    End Sub


End Class

#End Region

Public Class DtoLabelValue
    Public Property Id As Integer
    Public Property Label As String
    Public Property Value As Decimal

    Public Sub New(_id As Integer, _label As String, _value As Decimal)
        Me.Id = _id
        Me.Label = _label
        Me.Value = _value
    End Sub

End Class