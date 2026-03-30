import './style.css'
import Header from './components/Header'
import Main from './components/Main'
import Footer from './components/Footer'

const app = document.getElementById('app')
app.classList.add(
  'flex',
  'flex-1',
  'flex-col',
  'items-center',
  'min-h-screen',
  'bg-[#111827]',
  'text-[#F9FAFB]',
)

app.innerHTML = `
  ${Header()}
  ${Main()}
  ${Footer()}
`
