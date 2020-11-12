# auto-transportes

Para trabajar en el proyecto deben tener instalado el algún cliente de SQL (xampp), node en versión 13 o superior y la herramienta Git

## Clonar el proyecto:

para bajar el proyecto debemos situarnos **desde la terminal** en el directorio donde queremos clonar el proyecto

una vez hecho esto se escribirá:
```bash
git clone https://github.com/Rebjai/auto-transportes.git
```

ingresar las credenciales de sus cuentas de github y listo, se debería haber creado una carpeta con el nombre *auto-transportes*, en la cual nos meteremos con la consola con el comando:
```bash
cd auto-transportes
```

## Instalar dependencias
una vez descargado el proyecto se deben instalar las dependencias de desarrollo y producción, debemos asegurarnos que estamos dentro de la carpeta del proyecto y que contamos con un archivo llamado *package.json* y a continuación escribiremos:
```bash
npm install
```
## Correr el proyecto

Una vez instaladas las dependecias podemos levantar el servidor con el comando:
```bash
npm start
```

La consola deberá mostrar que se inició correctamente y para ingresar a la página sólamente debemos navegar a localhost en el puerto 4000:

http://localhost:4000/