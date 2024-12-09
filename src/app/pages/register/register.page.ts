import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { enviarCodigoService } from '../../services/enviarCodigo.service'; // Ajusta la ruta según sea necesario
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
  ValidatorFn,
} from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: false
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  loading!: HTMLIonLoadingElement; // Variable para manejar el componente de carga (loading)
  public isLoggedIn: boolean = false;
  wantsToSell: string = 'no';
  showPassword: boolean = false;
  currentStep: number = 1;

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private authService: AuthService,
    private enviarCodigoService: enviarCodigoService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        nombre: ['', Validators.required],
        apellido_paterno: ['', Validators.required],
        apellido_materno: ['', Validators.required],
        email: [
          '',
          [Validators.required, Validators.email, this.emailValidator],
        ],
        password: ['', [Validators.required, this.passwordValidator]],
        confirm_password: ['', Validators.required],
        wantsToSell: ['', []], 
        numberaVerificar: ['', Validators.required],
        checkconfirmacionCodigo: [false, Validators.requiredTrue],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );

    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  // ☢️ Método para manejar el envío del formulario de registro
  async onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    // Muestra un loading mientras se procesa el registro
    await this.presentLoading();

    const email = this.registerForm.get('email')?.value;
    const localPart = email.split('@')[0];
    const value = /^\d+$/.test(localPart);

    // Crea un nuevo objeto FormData
    const formData = new FormData();

    // Agrega manualmente los valores del formulario a FormData
    formData.append('nombre', this.registerForm.get('nombre')?.value);
    formData.append(
      'apellido_paterno',
      this.registerForm.get('apellido_paterno')?.value
    );
    formData.append(
      'apellido_materno',
      this.registerForm.get('apellido_materno')?.value
    );
    formData.append('email', this.registerForm.get('email')?.value);
    formData.append('password', this.registerForm.get('password')?.value);
    formData.append('wantsToSell', this.registerForm.get('wantsToSell')?.value);
    formData.append('tipoGmail', value.toString());
    formData.append(
      'numberaVerificar',
      this.registerForm.get('numberaVerificar')?.value
    );

    this.authService.register(formData).subscribe({
      next: async (response) => {
        await this.dismissLoading();
        console.log('Usuario registrado con éxito', response);
        // this.router.navigate(['star/login']);
          window.location.href = '/star/login';
      },
      error: async (error) => {
        console.error('Error en el registro', error);
        await this.dismissLoading();
        const errorMessage =
          error.error.msj ;
        await this.presentErrorAlert(errorMessage);
      },
    });
  }

  // Validador personalizado para el email de UTEQ
  emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@uteq\.edu\.mx$/;
    return emailRegex.test(control.value) ? null : { emailInvalid: true };
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(control.value) ? null : { passwordInvalid: true };
  }

  // Validador para asegurar que las contraseñas coincidan
  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirm_password')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  nextStep() {
    this.currentStep++;
  }

  previousStep() {
    this.currentStep--;
  }

  onNumberInput(event: any) {
    let input = event.target.value;
    input = input.replace(/\D/g, ''); // Elimina cualquier carácter que no sea un número
    input = input.replace(/(\d{2})(?=\d)/g, '$1 '); // Agrega un espacio después de cada dos dígitos
    event.target.value = input;
    this.registerForm.controls['numberaVerificar'].setValue(input); // Actualiza el valor en el formulario
  }

  checkEmailAndProceed() {
    const email = this.registerForm.get('email')?.value;
    const localPart = email.split('@')[0];
    const val = /^\d+$/.test(localPart);

    // Verifica si el correo es válido y si la parte local tiene solo números
    if (val === true) {
      // console.log(val, localPart);
      this.currentStep = 1; // uno para que me lleva al 2
      this.nextStep();
    } else if (val === false) {
      this.currentStep = 2; // dos para que me lleva al 3 sin pasar por el 2
      this.nextStep();
    }
  }

  verificaEmail() {
    // console.log(this.currentStep);
    const email = this.registerForm.get('email')?.value;
    const localPart = email.split('@')[0];
    const val = /^\d+$/.test(localPart);

    // Verifica si el correo es válido y si la parte local tiene solo números
    if (val === true) {
      this.currentStep = 1; // uno para que me lleva al 2
      this.nextStep();
    } else if (val === false) {
      this.currentStep = 0; // cero para que me lleva al 1
      this.nextStep();
    }
  }

  async EnviarCodigo() {
    const gmail = this.registerForm.get('email')?.value;
    // Muestra un loading mientras se procesa el registro
    await this.presentLoading();
    this.enviarCodigoService.EnviarCodigo(gmail).subscribe(
      (response) => {
        this.dismissLoading();
        this.nextStep();
      },
      (error) => {
        this.dismissLoading();
        // console.error('Error al enviar el código:', error);
        const errorMessage =
          error.error.msj ;
        this.presentErrorAlert(errorMessage);
      }
    );
  }

  // ☢️ Muestra el loading (spinner o animación de carga) mientras se procesa alguna acción
  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Cargando...',
      // cssClass: 'my-custom-loading-3',
    });
    await this.loading.present();
  }

  // ☢️ Oculta el loading cuando termina la acción
  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

  // ☢️ Muestra una alerta de error en caso de que el registro falle
  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error ❌',
      message:
        message ||
        'Hubo un problema con el registro. Por favor, inténtalo de nuevo.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
