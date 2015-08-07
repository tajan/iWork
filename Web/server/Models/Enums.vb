Public Enum ProjectMembershipTypes
    Manager = 1
    Member = 2
End Enum

Public Enum UserStoryStatuses
    Pending = 1
    InProgress = 2
    ReadyForTest = 3
    Done = 4
End Enum

Public Enum TaskStatuses
    Pending = 1
    InProgress = 2
    ReadyForTest = 3
    Done = 4
End Enum

Public Enum TaskTypes
    Generic = 1
    Support_Phone = 2
    Support_Meeting = 3
    Support_Email = 4
End Enum

Public Enum TaskScores
    Bad = 1
    NotBad = 2
    Good = 3
    VeryGood = 4
    Excellent = 5
End Enum

Public Enum TaskPriorities
    Low = 1
    Normal = 2
    High = 3
End Enum

Public Class EnumHelper

    Public Class UserStoryStatus

        Public Shared Function GetName(status As UserStoryStatuses) As String

            Select Case status
                Case UserStoryStatuses.Pending
                    Return "Pending"
                Case UserStoryStatuses.InProgress
                    Return "In Progress"
                Case UserStoryStatuses.ReadyForTest
                    Return "Ready For Test"
                Case UserStoryStatuses.Done
                    Return "Done"
            End Select

        End Function

    End Class

End Class