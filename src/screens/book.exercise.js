/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import React from 'react'
import debounceFn from 'debounce-fn'
import {FaRegCalendarAlt} from 'react-icons/fa'
import Tooltip from '@reach/tooltip'
import {useParams} from 'react-router-dom'
// 🐨 get useBook from 'utils/books'
// 🐨 get useListItem and useUpdateListItem from 'utils/list-items'
import {formatDate} from 'utils/misc'
import * as booksClient from 'utils/books-client'
import {useAsync} from 'utils/use-async'
import {loadingBook} from 'utils/book-placeholder'
import * as mq from 'styles/media-queries'
import * as colors from 'styles/colors'
import {Textarea} from 'components/lib'
import {Rating} from 'components/rating'
import {StatusButtons} from 'components/status-buttons'

function BookScreen() {
  const {bookId} = useParams()
  // 🐨 Replace all this logic with a simple call to useBook by passing the bookId
  // and you'll get the book in return
  // 💣 delete start
  const {data, run} = useAsync()

  React.useEffect(() => {
    run(booksClient.read(bookId))
  }, [run, bookId])

  const book = data?.book ?? loadingBook
  // 💣 delete end

  const {title, author, coverImageUrl, publisher, synopsis} = book

  // get the listItem for the book by calling useListItem and passing the bookId
  const listItem = null

  return (
    <div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gridGap: '2em',
          marginBottom: '1em',
          [mq.small]: {
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <img
          src={coverImageUrl}
          alt={`${title} book cover`}
          css={{width: '100%', maxWidth: '14rem'}}
        />
        <div>
          <div css={{display: 'flex', position: 'relative'}}>
            <div css={{flex: 1, justifyContent: 'space-between'}}>
              <h1>{title}</h1>
              <div>
                <i>{author}</i>
                <span css={{marginRight: 6, marginLeft: 6}}>|</span>
                <i>{publisher}</i>
              </div>
            </div>
            <div
              css={{
                right: 0,
                color: colors.gray80,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                minHeight: 100,
              }}
            >
              {book.loadingBook ? null : <StatusButtons book={book} />}
            </div>
          </div>
          <div css={{marginTop: 10, height: 46}}>
            {listItem?.finishDate ? <Rating listItem={listItem} /> : null}
            {listItem ? <ListItemTimeframe listItem={listItem} /> : null}
          </div>
          <br />
          <p>{synopsis}</p>
        </div>
      </div>
      {!book.loadingBook && listItem ? (
        <NotesTextarea listItem={listItem} />
      ) : null}
    </div>
  )
}

function ListItemTimeframe({listItem}) {
  const timeframeLabel = listItem.finishDate
    ? 'Start and finish date'
    : 'Start date'

  return (
    <Tooltip label={timeframeLabel}>
      <div aria-label={timeframeLabel} css={{marginTop: 6}}>
        <FaRegCalendarAlt css={{marginTop: -2, marginRight: 5}} />
        <span>
          {formatDate(listItem.startDate)}{' '}
          {listItem.finishDate ? `— ${formatDate(listItem.finishDate)}` : null}
        </span>
      </div>
    </Tooltip>
  )
}

function NotesTextarea({listItem}) {
  // 🐨 get the mutate function from useUpdateListItem
  // 💰 the update function (aka "mutate") is the first element of the returned array
  const update = () => {}
  const debouncedUpdate = React.useCallback(debounceFn(update, {wait: 300}), [])

  function handleNotesChange(e) {
    debouncedUpdate({id: listItem.id, notes: e.target.value})
  }

  return (
    <React.Fragment>
      <div>
        <label
          htmlFor="notes"
          css={{
            display: 'inline-block',
            marginRight: 10,
            marginTop: '0',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
          }}
        >
          Notes
        </label>
      </div>
      <Textarea
        id="notes"
        defaultValue={listItem.notes}
        onChange={handleNotesChange}
        css={{width: '100%', minHeight: 300}}
      />
    </React.Fragment>
  )
}

export {BookScreen}
