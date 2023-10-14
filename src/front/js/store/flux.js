const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			accessToken: null,
			userInfo: null,
			userEvent: [],
			userTeam: [],
			recoveryToken: [],
			message: null,
			allEvents: [],
			paymentInformation: [],
			userRegisters: [],
			registers: [],
			modalmsje: [
				{
					boton: "Click",
					header: "headerok",
					body: "bodyok",
					footer: "footerok"
				}
			],
			pdfUrl: null,
		},
		actions: {

			// Agrega esta acción a tu objeto 'actions' en flux.js
			resetPassword: async (email) => {
				try {
				const { apiFetchPublic } = getActions();
			
				// Realiza una solicitud HTTP pública para solicitar el restablecimiento de contraseña
				const resp = await apiFetchPublic("/recoverpassword", "POST", { email });
			
				// Verifica la respuesta del servidor
				if (resp.code === 200) {
					// Si la solicitud fue exitosa, puedes manejar la respuesta aquí
					// Por ejemplo, mostrar un mensaje al usuario
					console.log("Solicitud de recuperación de contraseña exitosa:", resp.data);
					const {recoveryToken} = resp.data
					localStorage.setItem("recoveryToken", recoveryToken)
						//guardamos el token en el store
						setStore({ recoveryToken: recoveryToken })

					
					return resp;
				} else if (resp.code === 404) {
					// Si el correo electrónico no se encuentra en la base de datos, puedes manejarlo aquí
					console.error("Correo electrónico no encontrado en la base de datos");
					return "Correo electrónico no encontrado en la base de datos";
				} else {
					// Maneja otros posibles errores aquí, por ejemplo, errores del servidor
					console.error("Error al procesar la solicitud de recuperación de contraseña:", resp);
					return "Error al procesar la solicitud de recuperación de contraseña";
				}
				} catch (error) {
				console.error("Error al realizar la solicitud de recuperación de contraseña:", error);
				// Maneja cualquier error que ocurra durante la solicitud HTTP
				return "Error al realizar la solicitud de recuperación de contraseña";
				}
			},
			// actions.js
			changePasswordRecovery: async (passwordToken, newPassword) => {
				const requestData = {
				"Password": newPassword, // Envía la nueva contraseña en un objeto con la propiedad 'password'
				};
			
				try {
				const response = await fetch(process.env.BACKEND_URL + "/api" + "/changepassword", {
					method: "POST",
					body: JSON.stringify(requestData), // Envía el objeto en el cuerpo de la solicitud
					headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + passwordToken,
					//"Access-Control-Allow-Origin": "*"
					}
				});
			
				if (response.code == 200) {
					// Contraseña cambiada con éxito en el servidor
					//const userData = await response.json();
			
					// Actualiza el estado global con la nueva contraseña
					/*setStore((prevStore) => ({
					...prevStore,
					userInfo: {
						...prevStore.userInfo,
						Password: userData.newPassword, // Suponiendo que 'userInfo' contiene la contraseña
					},
					})); */
					
					return 'Ok'; // Puedes devolver los datos actualizados si es necesario
				} else {
					// La solicitud al servidor falló
					throw new Error("La solicitud al servidor falló");
				}
				} catch (error) {
				// Ocurrió un error durante la solicitud
				throw error;
				}
			},
  
			updateProfileImage: async (newImageUrl) => {
				try {
					const { apiFetchProtected } = getActions();
					// Hace una solicitud al servidor para actualizar la imagen de perfil
					const resp = await apiFetchProtected("/updateimage", "POST", { newImageUrl });
					if (resp.code === 200) {
						// La imagen de perfil se actualizó con éxito en el servidor
						// Actualiza el estado global con la nueva URL de la imagen
						console.log('la respuesta es' + resp)
						/*setStore((prevStore) => ({
						  ...prevStore,
						  userInfo: {
							...prevStore.userInfo,
							profileImage: newImageUrl,
						  },
						})); */
					} else {
						// Maneja el caso en el que la API de actualización de la imagen de perfil devuelva un código de error
						console.error("Error al actualizar la imagen de perfil:", resp);
						// Puedes mostrar un mensaje de error o realizar otra acción aquí
					}
					return resp;
				} catch (error) {
					console.error("Error al actualizar la imagen:", error);
					// Maneja el caso en el que ocurra un error en la llamada a la API
					// Puedes mostrar un mensaje de error o realizar otra acción aquí
				}
			},
			apiFetchPublic: async (endpoint, method = "GET", body = null) => {
				try {
					var request
					if (method == "GET") {
						request = fetch(process.env.BACKEND_URL + "/api" + endpoint)
					} else {
						//objeto params con lo necesario para la petición que no es get
						const params = {
							method,
							headers: {
								"Content-Type": "application/json",
								"Access-Control-Allow-Origin": "*"
							}
						}
						//si hay body lo agregamos a los params
						if (body) params.body = JSON.stringify(body)
						request = fetch(process.env.BACKEND_URL + "/api" + endpoint, params)
					}
					//hacemos la petición
					const resp = await request
					//obtenemos los datos de la petición
					const data = await resp.json()
					//console.log("PRUEBA_fetchpublic" + JSON.stringify(data) + resp.status)
					return { code: resp.status, data }
				} catch (error) {
					console.log("Error al solicitar los datos", error)
				}
			},
			apiFetchProtected: async (endpoint, method = "GET", body = null) => {
				try {
					//objeto params con lo necesario para la petición que no es get
					//incluido token en encabezado de autorización
					const { accessToken } = getStore()
					if (!accessToken || accessToken == null) {
						return "No token"
					}
					const params = {
						method,
						headers: {
							"Authorization": "Bearer " + accessToken,
							"Access-Control-Allow-Origin": "*"
						}
					}
					//si hay body lo agregamos a los params
					if (body) {
						params.headers["Content-Type"] = "application/json",
							params.body = JSON.stringify(body)
					}
					//hacemos la petición
					const resp = await fetch(process.env.BACKEND_URL + "/api" + endpoint, params)
					//obtenemos los datos de la petición
					const data = await resp.json()
					console.log("PRUEBA_fetchprotected" + JSON.stringify(data) + resp.status)
					return { code: resp.status, data }
				} catch (error) {
					console.log("Error al solicitar los datos", error)
				}
			},
			// actions.js
				editProfile: async (newProfileData) => {
					try {
					const { apiFetchProtected } = getActions();
					const resp = await apiFetchProtected("/editprofile", "POST",  newProfileData );
						console.log(resp)
					if (resp.code === 200) {
						// Actualiza el estado global con la nueva información del perfil
						const store = getStore()
						store.userInfo.splice(newProfileData)
						setStore(store)
						alert("Perfil actualizado con exito")
						return "Ok"; // Puedes devolver los datos actualizados si es necesario
					} else {
						// La solicitud al servidor falló
						throw new Error("Error al procesar la solicitud de edición del perfil" + resp.code );
					}
					} catch (error) {
					  Error("Error al realizar la edición del perfil", error  );
					}
				},
  
			loadTokens: () => {
				//traer el token del almacenamiento local
				let token = localStorage.getItem("accessToken")
				setStore({ accessToken: token })
			},
			login: async (email, password) => {
				try {
					const { apiFetchPublic } = getActions()
					//hacemos la petición
					//trae de la API el code(resp.status) y data (mensaje y token)
					//es decir, lo que regresa la función apiFetchPublic()
					const resp = await apiFetchPublic("/login", "POST", { email, password })
					//console.log({resp})
					if (resp.code == 200) {
						//si no hubo error agrego la data de API a mis variables *****
						const { message, token } = resp.data
						//guardamos token en almacenamiento local
						localStorage.setItem("accessToken", token)
						//guardamos el token en el store
						setStore({ accessToken: token })
					} else {
						//borramos el token 
						//console.log("borramos el token")
						localStorage.removeItem("accessToken")
					}
					return resp
				} catch (error) {
					console.log("Error al solicitar los datos", error)
				}
			},
			signup: async (email, password, name) => {
				try {
					const { apiFetchPublic } = getActions()
					//hacemos la petición
					//trae de la API el code(resp.status) y data (mensaje y token)
					//es decir, lo que regresa la función apiFetchPublic()
					const resp = await apiFetchPublic("/signup", "POST", { email, password, name })
					return resp
				} catch (error) {
					console.log("Error al solicitar los datos")
				}
			},
			
			getUserInfo: async () => {
				try {
					const { apiFetchProtected } = getActions()
					const resp = await apiFetchProtected("/helloprotected")
					///////////// extra
					//console.log("PRUEBA_getuserinfo", resp)
					if (resp.code == 200) {
						setStore({ userInfo: resp.data })
						return "Ok"
					}
					//si el token expiró
					//borramos token del almacenamiento local y del store
					localStorage.removeItem("accessToken")
					if (resp.code == 401) {
						setStore({ accessToken: null })
						alert("Sesión expirada")
					}
					return "Sesión expirada"
				} catch (error) {
					console.log("Error al solicitar los datos", error)
				}
			},
			getMessage: async () => {
				try {
					// fetching data from the backend
					const { apiFetchPublic } = getActions()
					const data = await apiFetchPublic("/hello")
					//console.log("DATA: ", data)
					setStore({ message: data.data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			dataModal: (dataMsje) => {
				const store = getStore();
				store.modalmsje.splice(0, 1, dataMsje);
				setStore(store);
			},
			newEvent: async (eventData) => {
				try {
					const { apiFetchProtected } = getActions()
					//hacemos la petición
					//trae de la API el code(resp.status) y data
					//es decir, lo que regresa la función apiFetchPublic()
					//console.log("DATOSDELEVENTO: ", {eventData})
					const resp = await apiFetchProtected("/newevent", "POST", {eventData})
					if (resp == "No token" || resp.code == 401){
						//si el token expiró
						//borramos token del almacenamiento local y del store
						localStorage.removeItem("accessToken")
						setStore({accessToken:null})
					}
					if (resp.code==201){
						//setStore({userInfo:resp.data})
						const store = getStore();
						store.userEvent.push(resp.data);
						setStore(store);
						return "Ok"
					}
					return resp
				} catch(error){
					console.log("Error al crear el evento")
				}
			},
			editEvent:async(eventData, index)=>{
				try{
					const {apiFetchProtected} = getActions()
					//console.log("DATOSDELEVENTO: ", {eventData})
					const resp = await apiFetchProtected("/editevent", "POST", {eventData})
					if (resp == "No token"){
						//si el token expiró
						//borramos token del almacenamiento local y del store
						localStorage.removeItem("accessToken")
						setStore({accessToken:null})
					}
					if (resp.code==201){
						//setStore({userInfo:resp.data})
						const store = getStore();
						store.userEvent.splice(index, 1, resp.data);
						setStore(store);
						return "Ok"
					}
					return resp
				} catch(error){
					console.log("Error al editar el evento")
				}
			},
			deleteEvent:async(eventId, index)=>{
				try{
					const {apiFetchProtected} = getActions()
					//console.log("Id del evento a borrar: ", eventId)
					const resp = await apiFetchProtected("/deleteevent", "POST", {eventId})
					//console.log("PRUEBA_DeleteEvent", JSON.stringify(resp))
					//si el token expiró borramos token del almacenamiento local y del store
					if (resp.code == 201) {
						const store = getStore();
						store.userEvent.splice(index, 1);
						setStore(store);
						alert("Evento eliminado exitosamente");
						return "Ok"
					}
					if (resp == "No token"){
						//si el token expiró
						//borramos token del almacenamiento local y del store
						localStorage.removeItem("accessToken")
						setStore({accessToken:null})
					}
					return resp
				} catch(error){
					console.log("Error al borrar el evento")
				}
			},
			getUserEvent: async () => {
				try {
					const { apiFetchProtected } = getActions()
					const resp = await apiFetchProtected("/loadevents")
					if (resp == "No token" || resp.code == 401){
						//si el token expiró
						//borramos token del almacenamiento local y del store
						localStorage.removeItem("accessToken")
						setStore({accessToken:null})
					}
					//console.log("PRUEBA_getuserEvent", resp)
					if (resp.code == 200) {
						//setStore({userEvent:resp.data["eventos"]})
						setStore({ userEvent: resp.data.eventos })
						return "Ok"
					}
					//si el token expiró
					//borramos token del almacenamiento local y del store
					/*localStorage.removeItem("accessToken")
					if (resp.code == 401) {
						setStore({ accessToken: null })
						alert("Sesión expirada")
					}*/
					return resp
				} catch (error) {
					console.log("Error al solicitar los datos", error)
				}
			},
			newTeam: async (teamData) => {
				try {
					const { apiFetchProtected } = getActions()
					//hacemos la petición
					//trae de la API el code(resp.status) y data
					//es decir, lo que regresa la función apiFetchPublic()
					//console.log("DATOS DEL EQUIPO: ", {teamData})
					const resp = await apiFetchProtected("/newteam", "POST", {teamData})
					if (resp == "No token" || resp.code == 401){
						//si el token expiró borramos token del almacenamiento local y del store
						localStorage.removeItem("accessToken")
						setStore({accessToken:null})
					}
					//Si el equipo existe enviar error
					if (resp.code == 402) {
						return resp
					}
					if (resp.code == 201) {
						//setStore({userInfo:resp.data})
						const store = getStore();
						store.userTeam.push(resp.data);
						setStore(store);
						return "Ok"
					}
					//si el token expiró
					//borramos token del almacenamiento local y del store
					/*localStorage.removeItem("accessToken")
					if (resp.code==401){
						setStore({accessToken:null})
						alert("Sesión expirada")
					}*/
					return resp
				} catch(error){
					console.log("Error al crear el equipo")
				}
			},
			getUserTeams: async () => {
				try {
					const { apiFetchProtected } = getActions()
					const resp = await apiFetchProtected("/loaduserteams")
					if (resp == "No token" || resp.code == 401){
						//si el token expiró borramos token del almacenamiento local y del store
						localStorage.removeItem("accessToken")
						setStore({accessToken:null})
					}
					//console.log("PRUEBA_loaduserTeams", resp)
					if (resp.code==200){
						setStore({userTeam:resp.data.teams})
						return "Ok"
					}
					return resp
				}catch(error){
					console.log("Error al solicitar los datos", error)
				}
      		},
			editTeam:async(teamData, index)=>{
				try{
					const {apiFetchProtected} = getActions()
					const resp = await apiFetchProtected("/editteam", "POST", {teamData})
					if (resp == "No token" || resp.code == 401){
						//si el token expiró borramos token del almacenamiento local y del store
						localStorage.removeItem("accessToken")
						setStore({accessToken:null})
					}
					if (resp.code==201){
						//setStore({userInfo:resp.data})
						const store = getStore();
						store.userTeam.splice(index, 1, resp.data);
						setStore(store);
						return "Ok"
					}
					//si el token expiró
					//borramos token del almacenamiento local y del store
					/*localStorage.removeItem("accessToken")
					if (resp.code==401){
						setStore({accessToken:null})
						alert("Sesión expirada")
					}
					return "Sesión expirada"*/
					return resp
				} catch(error){
					console.log("Error al editar el equipo")
				}
			},
			deleteTeam:async(teamId, index)=>{
				try{
					const {apiFetchProtected} = getActions()
					//console.log("Id del equipo a borrar: ", teamId)
					const resp = await apiFetchProtected("/deleteteam", "POST", {teamId})
					//console.log("PRUEBA_DeleteTeam", JSON.stringify(resp))
					//si el token expiró borramos token del almacenamiento local y del store
					if (resp == "No token" || resp.code == 401){
						//si el token expiró
						//borramos token del almacenamiento local y del store
						localStorage.removeItem("accessToken")
						setStore({accessToken:null})
					}
					if (resp.code==201){
						const store = getStore();
						store.userTeam.splice(index, 1);
						setStore(store);
						alert("Equipo eliminado exitosamente");
						return "Ok"
					}
					/*localStorage.removeItem("accessToken")
					if (resp.code==401){
						setStore({accessToken:null})
						return ("Sesión expirada")
					}
					return "Sesión expirada"*/
					return resp
				} catch(error){
					console.log("Error al eliminar el equipo")
				}
			},
			logout: async () => {
				const { apiFetchProtected } = getActions();

				try {
					// Llama a la API de logout protegida utilizando apiFetchProtected
					const resp = await apiFetchProtected("/logout", "POST");

					if (resp.code === 200) {
						// Borra el token de acceso del almacenamiento local
						localStorage.removeItem("accessToken");

						// Borra el token de acceso del estado global
						const store = getStore();
						store.accessToken = null;
						setStore(store);

						// Redirige al usuario a la página de inicio de sesión
						//navigate('/'); 
					} else {
						// Maneja el caso en el que la API de logout devuelva un código de error
						console.error("Error al realizar logout:", resp);
						// Puedes mostrar un mensaje de error o realizar otra acción aquí
					}
				} catch (error) {
					console.error("Error al realizar logout:", error);
					// Maneja el caso en el que ocurra un error en la llamada a la API
					// Puedes mostrar un mensaje de error o realizar otra acción aquí
				}
			},
			getAllEvents: async () => {
				try {
					const { apiFetchPublic } = getActions();
					const resp = await apiFetchPublic("/loadallevents")
					///////////// extra
					//console.log("PRUEBA_getallEvent", resp)
					if (resp.code == 200) {
						//setStore({userEvent:resp.data["eventos"]})
						setStore({ allEvents: resp.data.eventos })
						return "Ok"
					}
					if (resp.code == 402) {
						/*setStore({ accessToken: null })
						alert("Sesión expirada")
					}
					return "Sesión expirada"*/
						return "No hay eventos";
					}
					return resp
				} catch (error) {
					console.log("Error al solicitar los datos", error)
				}
			},
			getUserEventsRegister: async () => {
				try {
					const { apiFetchProtected } = getActions()
					const resp = await apiFetchProtected("/loadusereventsregister")
					if (resp == "No token" || resp.code == 401){
						//si el token expiró borramos token del almacenamiento local y del store
						localStorage.removeItem("accessToken")
						setStore({accessToken:null})
					}
					//console.log("Prueba_getEventsRegister", resp)
					if (resp.code == 200) {
						setStore({ userEventsRegister: resp.data.eventos_disponibles })
						return "Ok"
					}
					return resp
				} catch (error) {
					console.log("Error al solicitar los datos", error)
				}
			},
			getRegisters: async () => {
				try {
					const { apiFetchProtected } = getActions()
					const resp = await apiFetchProtected("/loadregisters")
					if (resp == "No token" || resp.code == 401){
						//si el token expiró borramos token del almacenamiento local y del store
						localStorage.removeItem("accessToken")
						setStore({accessToken:null})
					}
					console.log("Prueba_getRegisters", resp)
					if (resp.code == 200) {
						setStore({ registers: resp.data.registros })
						return "Ok"
					}
					return resp
				} catch (error) {
					console.log("Error al solicitar los datos", error)
				}
			},
			newRegister: async (idEquipo, idEvento, fechaActual) => {
				try{
					const { apiFetchProtected } = getActions()
					console.log("Datos a registrar:", idEquipo, idEvento, fechaActual)
					const resp = await apiFetchProtected("/newregister", "POST", { idEquipo, idEvento, fechaActual })
					if (resp == "No token" || resp.code == 401){
						//si el token expiró borramos token del almacenamiento local y del store
						localStorage.removeItem("accessToken")
						setStore({accessToken:null})
					}
					console.log("Prueba newregister:", resp)
					if (resp.code == 200){
						const store = getStore();
						store.registers.push(resp.data.registros);
						setStore(store);
						return "Ok"
					}
					if (resp.code == 402){
						alert("El equipo ya está registrado")
					}
					return resp
				} catch (error){
					console.log("Error al hacer el registro", error)
				}
			}
			,
			savePaymentInfo: async (orderID,payerID,paymentSourceID,paymentID, index) => {
				try {
					const { apiFetchProtected } = getActions()
					console.log("PaypalData: ", paypalData, "indice", index )
					const resp = await apiFetchProtected("/pagos_paypal", "POST", { orderID,payerID,paymentSourceID,paymentID})
					console.log("PRUEBA_PaypalData", JSON.stringify(resp))
					if (resp.code == 201) {

						const store = getStore();
						store.paymentInformation.splice(index, 1, resp.data);
						setStore(store);
						return "Ok"
					}
					//si el token expiró
					//borramos token del almacenamiento local y del store
					localStorage.removeItem("accessToken")
					if (resp.code == 401) {
						setStore({ accessToken: null })
						alert("Sesión expirada")
					}
					return "Sesión expirada"
					//return resp
				} catch (error) {
					console.log("Error al agregar informacion de pago")
				}
			},
			savePdfUrl: (pdfUrl) => {
				const store = getStore();
				store.pdfUrl = pdfUrl;
				setStore(store);
			  },
		}
	};

};

export default getState;