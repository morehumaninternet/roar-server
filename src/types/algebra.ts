type Maybe<T> = T | null | undefined

type Done<T> = (err?: any, result?: T) => void
