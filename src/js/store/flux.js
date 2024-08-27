const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      contactList: [],
      demo: [
        { title: "FIRST", background: "white", initial: "white" },
        { title: "SECOND", background: "white", initial: "white" },
      ],
    },
    actions: {
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      loadContacts: async () => {
        try {
          const response = await fetch(
            "https://playground.4geeks.com/contact/agendas/Elias"
          );
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          setStore({ contactList: data.contacts });
        } catch (error) {}
      },

      newContact: async (contact) => {
        try {
          const response = await fetch(
            "https://playground.4geeks.com/contact/agendas/Elias/contacts",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(contact),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              `Error ${response.status}: ${
                errorData.message || "Error desconocido"
              }`
            );
          }

          const data = await response.json();
          if (!data || !data.contact || !data.contact.id) {
            throw new Error("El contacto creado no tiene un ID.");
          }

          await getActions().loadContacts();
          return data.contact;
        } catch (error) {
          console.error("Error al guardar el contacto:", error);
          throw error;
        }
      },

      editContact: async (id, contact) => {
        const apiUrl = `https://playground.4geeks.com/contact/agendas/Elias/contacts/${id}`;

        try {
          const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(contact),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              `Error ${response.status}: ${
                errorData.message || "Error al editar el contacto."
              }`
            );
          }

          const updatedContact = await response.json();
          await getActions().loadContacts();
          return updatedContact;
        } catch (error) {
          console.error("Error al editar el contacto:", error);
          alert(`Error al editar el contacto: ${error.message}`);
          throw error;
        }
      },

      deleteContact: async (id) => {
        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/Elias/contacts/${id}`,
            { method: "DELETE" }
          );
          if (!response.ok) throw new Error("Network response was not ok");
          await getActions().loadContacts();
          alert("Contacto eliminado con éxito.");
        } catch (error) {
          console.error("Failed to delete contact:", error);
          alert("Error al borrar contacto.");
        }
      },
    },
  };
};

export default getState;
