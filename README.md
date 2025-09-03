# Proyecto de Microservicios con Docker y Vagrant

Este proyecto es una aplicación web de comercio electrónico desarrollada con una arquitectura de microservicios. La aplicación se compone de un frontend y varios microservicios para gestionar usuarios, productos y pedidos.

## Arquitectura

La arquitectura de la aplicación se basa en los siguientes componentes:

  * **Frontend**: Una aplicación Flask que consume los microservicios.
  * **Microservicios**:
      * `users-api`: Gestiona los usuarios y la autenticación.
      * `products-api`: Gestiona los productos del catálogo.
      * `orders-api`: Gestiona los pedidos de los usuarios.
  * **Base de datos**: Una instancia de MySQL para la persistencia de datos.
  * **Service Discovery**: Consul se utiliza para el registro y descubrimiento de servicios.

Todo el entorno está orquestado con **Docker Compose** y se ejecuta dentro de una máquina virtual gestionada por **Vagrant**.

## Prerrequisitos

Antes de empezar, asegúrate de tener instalados los siguientes programas:

  * [Vagrant](https://www.vagrantup.com/downloads)
  * [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
  * [Docker](https://docs.docker.com/get-docker/)

## Instalación

Sigue estos pasos para configurar el entorno de desarrollo:

1.  **Clona el repositorio**:

    ```bash
    git clone https://github.com/vbg03/Parcial-1-Compu.git
    cd Parcial-1-Compu
    ```

2.  **Levanta la máquina virtual con Vagrant**:
    Este comando creará y configurará la máquina virtual `servidorUbuntu` definida en el `Vagrantfile`.

    ```bash
    vagrant up
    ```

3.  **Conéctate a la máquina virtual**:

    ```bash
    vagrant ssh servidorUbuntu
    ```

    Una vez dentro de la máquina virtual, todos los archivos del proyecto estarán en el directorio `/vagrant`.

## Cómo ejecutar la aplicación

Dentro de la máquina virtual (`servidorUbuntu`), navega hasta la carpeta del proyecto y utiliza Docker Compose para levantar todos los servicios:

```bash
cd /vagrant
docker compose up --build -d
```

Este comando construirá las imágenes de Docker para cada servicio (si es necesario) y los iniciará.

Una vez que todos los contenedores estén en funcionamiento, podrás acceder a la aplicación desde tu navegador en la siguiente URL:

[http://192.168.100.3:8080](https://www.google.com/search?q=http://192.168.100.3:8080)

## Servicios

La aplicación se compone de los siguientes servicios, cada uno accesible en un puerto diferente:

| Servicio | Puerto (Host) | Puerto (Contenedor) | Descripción |
| :--- | :--- | :--- | :--- |
| **Frontend** | `8080` | `5001` | Aplicación web principal |
| **Users API** | `5002` | `5002` | Microservicio de usuarios |
| **Products API** | `5003` | `5003` | Microservicio de productos |
| **Orders API** | `5004` | `5004` | Microservicio de pedidos |
| **Consul UI** | `8500` | `8500` | Interfaz de Consul para el descubrimiento de servicios |
| **MySQL** | `3306` | `3306` | Base de datos |