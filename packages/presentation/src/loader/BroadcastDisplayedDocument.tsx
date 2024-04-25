import {memo, useEffect} from 'react'
import type {SanityDocument} from 'sanity'
import {useDocumentPane} from 'sanity/structure'

import {usePresentationParams} from '../usePresentationParams'
import {useDisplayedDocumentBroadcaster} from './DisplayedDocumentBroadcaster'

/**
 * Sanity Form input component that reads the current form state and broadcasts it to
 * the live query store
 */
function BroadcastDisplayedDocument(props: {
  value: Partial<SanityDocument> | null | undefined
}): null {
  const setDisplayedDocument = useDisplayedDocumentBroadcaster()
  // @TODO refactor logic into a child component so that `useDocumentPane` is only called when actually needed
  const {editState} = useDocumentPane()
  const params = usePresentationParams(false)

  useEffect(() => {
    if (
      params?.perspective !== 'published' ||
      (params?.perspective === 'published' &&
        editState?.published &&
        !params?.prefersLatestPublished) ||
      !editState?.published
    ) {
      const timeout = setTimeout(() => setDisplayedDocument?.(props.value), 100)
      return () => clearTimeout(timeout)
    }
    return
  }, [
    editState?.published,
    params?.perspective,
    params?.prefersLatestPublished,
    props.value,
    setDisplayedDocument,
  ])

  return null
}

export default memo(BroadcastDisplayedDocument)
