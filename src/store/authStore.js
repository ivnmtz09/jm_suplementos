// src/store/authStore.js
import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/store/firebase";

const useAuthStore = create((set) => ({
  user: null,
  role: null,       // 'admin' | 'staff' | null
  loading: true,    // true mientras Firebase verifica la sesión inicial

  /** Inicia sesión y consulta el rol en Firestore */
  login: async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    let role = null;
    try {
      const snap = await getDoc(doc(db, "usuarios", uid));
      role = snap.exists() ? snap.data().rol : null;
    } catch (error) {
      console.error("Error fetching user role on login:", error);
    }

    set({ user: credential.user, role });
    return role;
  },

  /** Cierra sesión */
  logout: async () => {
    await signOut(auth);
    set({ user: null, role: null });
  },

  /** Registra el listener de Firebase Auth e impide reabrir rutas hasta resolver Firestore */
  checkAuth: () => {
    // Al iniciar checkAuth, loading debe ser true
    set({ loading: true });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let role = null;
        try {
          const snap = await getDoc(doc(db, "usuarios", firebaseUser.uid));
          role = snap.exists() ? snap.data().rol : null;
          
          // Debugging solicitado
          console.log("UID Actual:", firebaseUser.uid);
          console.log("Rol Detectado:", role);

        } catch (error) {
          console.error("Error fetching user role in checkAuth:", error);
        }
        
        // CRÍTICO: No cambiar loading a false hasta tener el role final
        set({ user: firebaseUser, role, loading: false });
      } else {
        // No hay usuario
        set({ user: null, role: null, loading: false });
      }
    });

    return unsubscribe;
  },
}));

export default useAuthStore;
