import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { SpinnerService } from '../../services/spinner.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: false
})
export class LoginPage implements OnInit {
  loginForm: FormGroup; // Formulario para capturar las credenciales del usuario
  loading!: HTMLIonLoadingElement; // Variable para manejar el componente de carga (loading)
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder, // Para crear y gestionar el formulario reactivo
    private router: Router, // Para navegar entre páginas de la aplicación
    private loadingController: LoadingController, // Controlador para mostrar y ocultar la animación de carga
    private alertController: AlertController, // Controlador para mostrar alertas o modales
    private AuthService: AuthService,
    private spinnerService: SpinnerService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // Método del ciclo de vida de Angular que se ejecuta al inicializar el componente
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // ☢️ Método para manejar el envío del formulario de login
  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.spinnerService.show();
    await this.presentLoading();

    // Llama al servicio de autenticación para iniciar sesión con el nombre de usuario y la contraseña
    this.AuthService.login(
      this.loginForm.controls['username'].value,
      this.loginForm.controls['password'].value
    ).subscribe({
      next: async () => {
        this.spinnerService.hide();
        await this.dismissLoading();
        // this.router.navigate(['/star/home']);
        window.location.href = '/star/home';
      },
      error: async (error) => {
        this.spinnerService.hide();
        console.error(error);
        await this.dismissLoading();
        await this.presentErrorAlert();
      },
    });
  }

  // ☢️ Muestra el loading (spinner o animación de carga) mientras se procesa alguna acción
  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: null, // Tipo de spinner (puedes cambiar el valor para usar un spinner predeterminado)
      cssClass: 'my-custom-loading-3', // Clase CSS personalizada para el estilo del loading
    });
    // await this.loading.present(); // Muestra el loading
  }

  // ☢️ Oculta el loading cuando ya no es necesario (por ejemplo, al completar el proceso de login)
  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss(); // Oculta el loading si está presente
    }
  }

  // ☢️ Función que se ejecuta cada vez que se ingresa a la vista actual (ciclo de vida de Ionic)
  async ionViewWillEnter() {
    await this.presentLoading(); // Muestra el loading al entrar a la vista
    setTimeout(async () => {
      await this.dismissLoading(); // Oculta el loading después de un segundo
    }, 1000);
  }

  // ☢️ Muestra una alerta en caso de error al iniciar sesión (credenciales incorrectas)
  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error', // Título de la alerta
      message: 'Credenciales incorrectas. Por favor, intente de nuevo.', // Mensaje que se muestra en la alerta
      buttons: ['OK'], // Botón de confirmación
    });

    await alert.present(); // Muestra la alerta
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
