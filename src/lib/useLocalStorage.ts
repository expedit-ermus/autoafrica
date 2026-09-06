'use client';

import { useCallback, useRef, useSyncExternalStore } from 'react';

/**
 * Lecture d'une valeur de `localStorage` compatible rendu serveur.
 *
 * Le motif habituel — `useState` vide puis `setState` dans un `useEffect` —
 * déclenche un rendu en cascade et un avertissement React 19. `useSyncExternalStore`
 * est fait pour ça : React connaît la valeur serveur et la valeur client, et gère
 * lui-même la transition sans erreur d'hydratation.
 *
 * Piège évité ici : `getSnapshot` doit renvoyer une référence **stable** tant que
 * la donnée n'a pas changé. Renvoyer un objet fraîchement analysé à chaque appel
 * provoque une boucle de rendu infinie. On mémorise donc la chaîne brute et le
 * résultat de son analyse, et on ne ré-analyse que si la chaîne a changé.
 *
 * Effet de bord bienvenu : l'abonnement à l'événement `storage` synchronise les
 * onglets — un panier modifié dans un onglet se met à jour dans les autres.
 */

/** Notifie les abonnés du même onglet (l'événement `storage` ne concerne que les autres). */
const localListeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  localListeners.add(onStoreChange);
  window.addEventListener('storage', onStoreChange);
  return () => {
    localListeners.delete(onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

/** À appeler après toute écriture, pour que les composants abonnés se rafraîchissent. */
export function notifyLocalStorageChange() {
  for (const listener of localListeners) listener();
}

/** Écrit une valeur et prévient les abonnés. Ne lève jamais : stockage bloqué = silence. */
export function writeLocalStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    notifyLocalStorageChange();
  } catch {
    // Navigation privée ou stockage désactivé : la valeur n'est pas conservée.
  }
}

export function removeLocalStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
    notifyLocalStorageChange();
  } catch {
    // idem
  }
}

/**
 * @param key          clé de stockage
 * @param parse        transforme la chaîne brute en valeur exploitable
 * @param serverValue  valeur retenue pendant le rendu serveur et le premier rendu client
 */
export function useLocalStorageValue<T>(
  key: string,
  parse: (raw: string | null) => T,
  serverValue: T,
): T {
  // Mémoire du dernier couple (chaîne brute, valeur analysée).
  const cache = useRef<{ raw: string | null; value: T } | null>(null);

  const getSnapshot = useCallback((): T => {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      raw = null;
    }

    // Référence stable tant que la chaîne stockée n'a pas bougé.
    if (cache.current && cache.current.raw === raw) return cache.current.value;

    const value = parse(raw);
    cache.current = { raw, value };
    return value;
  }, [key, parse]);

  const getServerSnapshot = useCallback(() => serverValue, [serverValue]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
