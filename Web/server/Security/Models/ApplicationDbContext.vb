Imports System.Security.Claims
Imports System.Threading.Tasks
Imports Microsoft.AspNet.Identity
Imports Microsoft.AspNet.Identity.EntityFramework
Imports Microsoft.AspNet.Identity.Owin
Imports System.Data.Entity
Imports System.Data.Entity.Validation
Imports System.Web

Public Class ApplicationDbContext
    Inherits IdentityDbContext(Of User, Role, Integer, UserLogin, UserRole, UserClaim)

    Public Sub New()
        MyBase.New("DefaultConnection")
        MyBase.Configuration.LazyLoadingEnabled = False
        MyBase.Configuration.ProxyCreationEnabled = False
        Database.SetInitializer(New AuthDBInitializer)
    End Sub

    Protected Overrides Sub OnModelCreating(modelBuilder As Entity.DbModelBuilder)

        MyBase.OnModelCreating(modelBuilder)

        modelBuilder.Entity(Of User).ToTable("Users")
        modelBuilder.Entity(Of Role).ToTable("Roles")
        modelBuilder.Entity(Of UserRole)().ToTable("UserRoles")
        modelBuilder.Entity(Of UserLogin)().ToTable("UserLogins")
        modelBuilder.Entity(Of UserClaim)().ToTable("UserClaims")

    End Sub

    Public Shared Function Create() As ApplicationDbContext
        Return New ApplicationDbContext()
    End Function

End Class

Public Class AuthDBInitializer
    Inherits DropCreateDatabaseIfModelChanges(Of ApplicationDbContext)

    Protected Overrides Sub Seed(context As ApplicationDbContext)
        InitContacts(context)
    End Sub

    Private Sub InitContacts(context As ApplicationDbContext)

        Try
            'Dim userManager = HttpContext.Current.GetOwinContext().GetUserManager(Of ApplicationUserManager)()
            'Dim user = userManager.FindAsync("amir@tajan.ir", "123456").Result

            'If user Is Nothing Then

            '    user = New User
            '    user.Email = "amir@tajan.ir"
            '    user.UserName = "amir@tajan.ir"
            '    user.DisplayName = "Amir Pournasserian"
            '    user.Description = "default admin user"

            '    Dim result = userManager.CreateAsync(user, "123456").Result

            '    user = userManager.FindAsync("amir@tajan.ir", "123456").Result

            '    Dim result1 = userManager.AddToRoleAsync(user.Id, "admin").Result


            'End If



        Catch ex As DbEntityValidationException

            For Each eve In ex.EntityValidationErrors
                Console.WriteLine("Entity of type {0} in state {1} has the following validation errors:", eve.Entry.Entity.GetType().Name, eve.Entry.State)
                For Each ve In eve.ValidationErrors
                    Console.WriteLine("- Property: {0}, Error: {1}", ve.PropertyName, ve.ErrorMessage)
                Next

                Throw ex
            Next

        End Try

    End Sub

End Class