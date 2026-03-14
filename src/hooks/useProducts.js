// src/hooks/useProducts.js
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/store/firebase";

/**
 * Custom hook que suscribe en tiempo real a la colección "productos" de Firestore.
 * @returns {{ products: Array, loading: boolean, error: string|null }}
 */
function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("nombre"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          // Normaliza los campos al inglés para uso interno
          name: doc.data().nombre ?? doc.data().name ?? "Sin nombre",
          price: doc.data().precio ?? doc.data().price ?? 0,
          description:
            doc.data().descripcion ?? doc.data().description ?? "",
          image: doc.data().imagen ?? doc.data().image ?? "",
          category: doc.data().categoria ?? doc.data().category ?? "",
          stock: doc.data().stock ?? 0,
          ...doc.data(),
        }));
        setProducts(docs);
        setLoading(false);
      },
      (err) => {
        console.error("[useProducts] Firestore error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cancelar la suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  return { products, loading, error };
}

export default useProducts;
