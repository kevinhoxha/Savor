import { SolitoImageProvider } from 'solito/image'
import { Dripsy } from './dripsy'
import { AuthProvider } from 'app/context/AuthContext'
import { SafeAreaView } from 'dripsy'
import { SafeArea } from './safe-area'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SolitoImageProvider nextJsURL="http://localhost:3000">
      <AuthProvider>
        <Dripsy>
          <SafeArea style={{ flex: 1, flexGrow: 1, backgroundColor: '#ddf4fa' }}>{children}</SafeArea>
        </Dripsy>
      </AuthProvider>
    </SolitoImageProvider>
  )
}
