import { useState, useCallback } from 'react'

export const useLegacyState = <State>(initialState: State | (() => State)) => {
  const [state, setState] = useState<State>(initialState)
  const newSetState = useCallback((state: Partial<State>) => {
    setState(oldState => ({ ...oldState, ...state }))
  }, [])
  return [state as State, newSetState] as [State, typeof newSetState]
}
