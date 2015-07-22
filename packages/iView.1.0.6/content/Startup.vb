Imports Microsoft.Owin
Imports Owin
Imports System.Web.Hosting
Imports iView.ViewEngine

<Assembly: OwinStartup("iViewStartup", GetType(Startup))> 
Public Class Startup

    Public Sub Configuration(app As IAppBuilder)
        app.iViewConfig()
    End Sub

End Class