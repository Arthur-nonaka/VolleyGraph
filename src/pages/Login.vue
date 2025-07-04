<template>
  <div class="login-container">
    <div class="login-box">
      <div
        class="data-container"
        :style="
          isLoginActive
            ? { transform: 'translateX(75%)', borderRadius: '0 15px 15px 0' }
            : { transform: 'translateX(-75%)', borderRadius: '15px 0 0 15px' }
        "
      >
        <div v-if="isLoginActive">
          <h1>Logar</h1>
          <form @submit.prevent="loginUser">
            <input type="text" placeholder="Email" v-model="loginData.email" />
            <input
              type="password"
              placeholder="Senha"
              v-model="loginData.password"
            />
            <p>Esqueceu a Senha?</p>
            <button>Entrar</button>
            <p>
              Novo Aqui?
              <span @click="isLoginActive = false">Crie sua Conta</span>
            </p>
          </form>
          <small v-if="errorMessage">
            <div class="text-danger">
              {{ errorMessage.data }}
            </div>
          </small>
        </div>

        <div v-if="!isLoginActive">
          <h1>Cadastrar</h1>
          <form @submit.prevent="submitForm">
            <input type="text" placeholder="Email" v-model="formData.email" />
            <input
              type="password"
              placeholder="Senha"
              v-model="formData.password"
            />
            <input
              type="password"
              placeholder="Confirmar Senha"
              v-model="formData.confirmPassword"
            />
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: center;
              "
            >
              <input
                type="checkbox"
                id="isAdmin"
                v-model="formData.isAdmin"
                style="width: 20px; height: 20px"
              />
              <label for="isAdmin" style="margin-left: 0.5rem"
                >Cadastrar como admin</label
              >
            </div>
            <button type="submit" style="margin-top: 2rem">Cadastrar</button>
            <p>
              Já tem uma Conta?
              <span @click="isLoginActive = true">Entre Agora</span>
            </p>
          </form>
          <small>
            <div class="text-danger" v-if="errors.email">
              {{ errors.email }}
            </div>
            <div class="text-danger" v-if="errors.password">
              {{ errors.password }}
            </div>
            <div class="text-danger" v-if="errors.confirmPassword">
              {{ errors.confirmPassword }}
            </div>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UserService from "@/api/UserService";
import { useRouter } from "vue-router";

const isLoginActive = ref(true);
const router = useRouter();
const errorMessage = ref<string | null>(null);

const formData = ref({
  email: "",
  password: "",
  confirmPassword: "",
  isAdmin: false,
});

const loginData = ref({
  email: "",
  password: "",
});

const errors = ref({
  email: "",
  password: "",
  confirmPassword: "",
});

const validateForm = () => {
  let isValid = true;

  errors.value = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = "As senhas não coincidem";
    isValid = false;
  }

  return isValid;
};

const submitForm = async () => {
  if (validateForm()) {
    const payload = {
      ...formData.value,
      isAdmin: formData.value.isAdmin === true
    };
    await UserService.createUser(payload)
      .then((response) => {
        console.log("Usuário cadastrado com sucesso:", response.data);
        localStorage.setItem("token", response.data.token); 
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem(
          "isAdmin",
          response.data.isAdmin === true ? "true" : "false"
        );
        router.push("/");
      })
      .catch((error) => {
        if (error.status === 400) {
          const validationErrors = error.response.data;
          if (Array.isArray(validationErrors)) {
            validationErrors.forEach(
              (err: {
                property: keyof typeof errors.value;
                constraints: Record<string, string>;
              }) => {
                errors.value[err.property] = Object.values(
                  err.constraints
                ).join(", ");
              }
            );
          } else {
            console.error("Erro de validação inesperado:", validationErrors);
          }
          console.log(errors);
        } else {
          console.error("Erro ao cadastrar usuário:", error);
        }
      });
  } else {
    console.log("Formulário inválido", errors.value);
  }
};

const loginUser = () => {
  errorMessage.value = null;
  console.log("Tentando logar com:", loginData.value);

  UserService.loginUser(loginData.value)
    .then((response) => {
      if (response.data.isAdmin) {
        console.log("Admin");
      }
      console.log("Login bem-sucedido:", response);
      localStorage.setItem("token", "123");
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("isAdmin", response.data.isAdmin ? "true" : "false");
      router.push("/");
    })
    .catch((error) => {
      if (error.status === 400) {
        errorMessage.value = error.response.data;
      } else {
        console.error("Erro ao logar usuário:", error);
      }
    });
};
</script>

<style scoped>
/* Estilização da Página */
.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--vt-c-blue) 80%,
    var(--vt-c-dark-blue)
  );
}

.login-box {
  position: relative;
  z-index: 10;
  background-image: url("./loginBackground.jpg");
  background-size: 100%;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
  text-align: center;
  width: 70vw;
  height: 70vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.login-box input {
  width: 70%;
  height: 6vh;
  padding: 15px;
  padding-left: 20px;
  margin: 8px 0;
  border: 2px solid rgb(204, 204, 204);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.2);
  color: black;
  font-size: 1.2em;
}

.login-box input::placeholder {
  color: rgb(204, 204, 204);
}

.login-box button {
  width: 70%;
  height: 6vh;
  padding: 0.2rem;
  background-image: linear-gradient(
    45deg,
    var(--vt-c-blue),
    var(--vt-c-dark-blue)
  );
  border: none;
  border-radius: 30px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-position 0.4s ease, transform 0.4s ease;
  background-size: 200%;
  background-position: left;
  position: relative;
  text-align: center;
}

.login-box button:hover {
  background-position: right;
}

.data-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
  width: 28vw;
  justify-content: center;
  transition: all 0.5s ease-in-out;

  > div > h1,
  p,
  span {
    color: rgb(87, 87, 87);
  }

  div > form > p > span {
    color: var(--vt-c-blue);
    cursor: pointer;
  }

  div > form > p > span:hover {
    text-decoration: underline;
  }
}
</style>
