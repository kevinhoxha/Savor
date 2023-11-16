import { useSx, View } from 'dripsy'
import { ButtonLink } from 'app/components/Button'
import { SolitoImage } from 'solito/image'

export function HomeScreen() {
  const sx = useSx()

  return (
    <View sx={styles.container}>
      <SolitoImage
        src="/logo.jpg"
        width={325}
        height={325}
        contentFit
        onLayout={() => {}}
        style={{ marginBottom: 50, borderRadius: 15 }}
        alt="logo"
        resizeMode="contain"
      />
      <View sx={{flex: 1, gap: 40, flexDirection: "row"}}>
        <ButtonLink href="/register">Register</ButtonLink>
        <ButtonLink href="/login">Login</ButtonLink>
      </View>
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    marginBottom: 50,
    borderRadius: 15,
  },
  registerButton: {
    marginTop: 10,
  },
  loginButton: {
    marginBottom: 10,
  },
}

// import { Text, useSx, View, H1, P, Row, A } from 'dripsy'
// import { TextLink } from 'solito/link'
// import { MotiLink } from 'solito/moti'

// export function HomeScreen() {
//   const sx = useSx()

//   return (
//     <View
//       sx={{ flex: 1, justifyContent: 'center', alignItems: 'center', p: 16 }}
//     >
//       <H1 sx={{ fontWeight: '800' }}>Welcome to Solito.</H1>
//       <View sx={{ maxWidth: 600 }}>
//         <P sx={{ textAlign: 'center' }}>
//           Here is a basic starter to show you how you can navigate from one
//           screen to another. This screen uses the same code on Next.js and React
//           Native.
//         </P>
//         <P sx={{ textAlign: 'center' }}>
//           Solito is made by{' '}
//           <A
//             href="https://twitter.com/fernandotherojo"
//             // @ts-expect-error react-native-web only types
//             hrefAttrs={{
//               target: '_blank',
//               rel: 'noreferrer',
//             }}
//             sx={{ color: 'blue' }}
//           >
//             Fernando Rojo
//           </A>
//           .
//         </P>
//       </View>
//       <View sx={{ height: 32 }} />
//       <Row>
//         <TextLink
//           href="/user/fernando"
//           textProps={{
//             style: sx({ fontSize: 16, fontWeight: 'bold', color: 'blue' }),
//           }}
//         >
//           Regular Link
//         </TextLink>
//         <View sx={{ width: 32 }} />
//         <MotiLink
//           href="/user/fernando"
//           animate={({ hovered, pressed }) => {
//             'worklet'

//             return {
//               scale: pressed ? 0.95 : hovered ? 1.1 : 1,
//               rotateZ: pressed ? '0deg' : hovered ? '-3deg' : '0deg',
//             }
//           }}
//           from={{
//             scale: 0,
//             rotateZ: '0deg',
//           }}
//           transition={{
//             type: 'timing',
//             duration: 150,
//           }}
//         >
//           <Text
//             selectable={false}
//             sx={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}
//           >
//             Moti Link
//           </Text>
//         </MotiLink>
//       </Row>
//     </View>
//   )
// }