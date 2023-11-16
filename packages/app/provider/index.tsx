import { SolitoImageProvider } from 'solito/image'
import { Dripsy } from './dripsy'
import { AuthProvider } from 'app/context/AuthContext'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SolitoImageProvider nextJsURL="http://localhost:3000">
      <AuthProvider>
        <Dripsy>{children}</Dripsy>
      </AuthProvider>
    </SolitoImageProvider>
  )
}
