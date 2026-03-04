export interface Selection {
  x: number
  xPercent : number
  y: number
  yPercent: number
  character: string
}

export interface Status {
  name: string
  found: boolean
}

export interface TimeResult {
  username: string
  time: number
}