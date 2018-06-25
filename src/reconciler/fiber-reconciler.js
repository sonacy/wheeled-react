import {createFiberRoot} from './fiber-root'

export function createContainer(container, isAsync, hydrate) {
  return createFiberRoot(container, isAsync, hydrate)
}
