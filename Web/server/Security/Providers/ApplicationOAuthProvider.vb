Imports System.Security.Claims
Imports System.Threading.Tasks
Imports Microsoft.AspNet.Identity
Imports Microsoft.AspNet.Identity.EntityFramework
Imports Microsoft.AspNet.Identity.Owin
Imports Microsoft.Owin.Security
Imports Microsoft.Owin.Security.Cookies
Imports Microsoft.Owin.Security.OAuth

Public Class ApplicationOAuthProvider
    Inherits OAuthAuthorizationServerProvider
    Private ReadOnly _publicClientId As String

    Public Sub New(publicClientId As String)
        If publicClientId Is Nothing Then
            Throw New ArgumentNullException("publicClientId")
        End If

        _publicClientId = publicClientId
    End Sub

    Public Overrides Async Function GrantResourceOwnerCredentials(context As OAuthGrantResourceOwnerCredentialsContext) As System.Threading.Tasks.Task
        Dim userManager As ApplicationUserManager = context.OwinContext.GetUserManager(Of ApplicationUserManager)()
        Dim user As User = Await userManager.FindAsync(context.UserName, context.Password)

        If user Is Nothing Then
            context.SetError("invalid_grant", "The user name or password is incorrect.")
            Return
        End If

        Dim oAuthIdentity As ClaimsIdentity = Await user.GenerateUserIdentityAsync(userManager, OAuthDefaults.AuthenticationType)
        Dim cookiesIdentity As ClaimsIdentity = Await user.GenerateUserIdentityAsync(userManager, CookieAuthenticationDefaults.AuthenticationType)

        Dim properties As AuthenticationProperties = CreateProperties(user)
        Dim ticket As New AuthenticationTicket(oAuthIdentity, properties)
        context.Validated(ticket)
        context.Request.Context.Authentication.SignIn(cookiesIdentity)
    End Function

    Public Overrides Function TokenEndpoint(context As OAuthTokenEndpointContext) As System.Threading.Tasks.Task
        For Each [property] As KeyValuePair(Of String, String) In context.Properties.Dictionary
            context.AdditionalResponseParameters.Add([property].Key, [property].Value)
        Next

        Return System.Threading.Tasks.Task.FromResult(Of Object)(Nothing)
    End Function

    Public Overrides Function ValidateClientAuthentication(context As OAuthValidateClientAuthenticationContext) As System.Threading.Tasks.Task
        ' Resource owner password credentials does not provide a client ID.
        If context.ClientId Is Nothing Then
            context.Validated()
        End If

        'context.OwinContext.Set(Of String)("as:clientAllowedOrigin", client.AllowedOrigin)
        'context.OwinContext.Set(Of String)("as:clientRefreshTokenLifeTime", client.RefreshTokenLifeTime.ToString())

        Return System.Threading.Tasks.Task.FromResult(Of Object)(Nothing)
    End Function

    Public Overrides Function ValidateClientRedirectUri(context As OAuthValidateClientRedirectUriContext) As System.Threading.Tasks.Task
        If context.ClientId = _publicClientId Then
            Dim expectedRootUri As New Uri(context.Request.Uri, "/")

            If expectedRootUri.AbsoluteUri = context.RedirectUri Then
                context.Validated()
            End If
        End If

        Return System.Threading.Tasks.Task.FromResult(Of Object)(Nothing)
    End Function

    Public Shared Function CreateProperties(user As User) As AuthenticationProperties

        Dim data As IDictionary(Of String, String) = New Dictionary(Of String, String)

        data.Add("userName", user.UserName)
        data.Add("email", user.Email)
        data.Add("id", user.Id)

        If String.IsNullOrEmpty(user.DisplayName) Then
            data.Add("displayName", "")
        Else
            data.Add("displayName", user.DisplayName)
        End If

        If String.IsNullOrEmpty(user.PhoneNumber) Then
            data.Add("phoneNumber", "")
        Else
            data.Add("phoneNumber", user.PhoneNumber)
        End If

        If String.IsNullOrEmpty(user.Picture) Then
            data.Add("picture", "")
        Else
            data.Add("picture", user.Picture)
        End If

        If String.IsNullOrEmpty(user.description) Then
            data.Add("description", "")
        Else
            data.Add("description", user.description)
        End If

        Return New AuthenticationProperties(data)

    End Function

End Class
