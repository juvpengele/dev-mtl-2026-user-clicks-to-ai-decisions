import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Deck } from './deck/Deck'
import { Presenter } from './deck/Presenter'
import { PrintView } from './deck/PrintView'
import './theme.css'
import './presenter.css'

const params = new URLSearchParams(location.search)
const view = params.has('print') ? <PrintView /> : params.has('presenter') ? <Presenter /> : <Deck />

createRoot(document.getElementById('root')!).render(
  <StrictMode>{view}</StrictMode>,
)
