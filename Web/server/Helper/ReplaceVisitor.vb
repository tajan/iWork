Imports System.Linq.Expressions

Public Class ReplaceVisitor
    Inherits ExpressionVisitor
    Private ReadOnly from As Expression, [to] As Expression
    Public Sub New(from As Expression, [to] As Expression)
        Me.from = from
        Me.[to] = [to]
    End Sub
    Public Overrides Function Visit(node As Expression) As Expression

        Return If(node Is from, [to], MyBase.Visit(node))
    End Function
End Class
