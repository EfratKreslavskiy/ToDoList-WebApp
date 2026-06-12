export interface ColorOption {
  id: string
  label: string
  cardClass: string
  borderClass: string
  buttonClass: string
  dotClass: string
}

export const LIST_COLORS: ColorOption[] = [
  {
    id: 'red',
    label: 'Red',
    cardClass: 'bg-red-300',
    borderClass: 'border-red-400',
    buttonClass: 'border-red-500 bg-red-400 text-slate-950 hover:bg-red-500',
    dotClass: 'bg-red-700'
  },
  {
    id: 'orange',
    label: 'Orange',
    cardClass: 'bg-orange-300',
    borderClass: 'border-orange-400',
    buttonClass: 'border-orange-500 bg-orange-400 text-slate-950 hover:bg-orange-500',
    dotClass: 'bg-orange-700'
  },
  {
    id: 'green',
    label: 'Green',
    cardClass: 'bg-green-300',
    borderClass: 'border-green-400',
    buttonClass: 'border-green-500 bg-green-400 text-slate-950 hover:bg-green-500',
    dotClass: 'bg-green-700'
  },
  {
    id: 'blue',
    label: 'Blue',
    cardClass: 'bg-blue-300',
    borderClass: 'border-blue-400',
    buttonClass: 'border-blue-500 bg-blue-400 text-slate-950 hover:bg-blue-500',
    dotClass: 'bg-blue-700'
  },
  {
    id: 'purple',
    label: 'Purple',
    cardClass: 'bg-purple-300',
    borderClass: 'border-purple-400',
    buttonClass: 'border-purple-500 bg-purple-400 text-slate-950 hover:bg-purple-500',
    dotClass: 'bg-purple-700'
  },
  {
    id: 'teal',
    label: 'Teal',
    cardClass: 'bg-teal-300',
    borderClass: 'border-teal-400',
    buttonClass: 'border-teal-500 bg-teal-400 text-slate-950 hover:bg-teal-500',
    dotClass: 'bg-teal-700'
  }
]

export const DEFAULT_LIST_COLOR_ID = 'blue'

export function getColorOption(colorId: string): ColorOption {
  return LIST_COLORS.find((color) => color.id === colorId) ?? LIST_COLORS[3]
}
