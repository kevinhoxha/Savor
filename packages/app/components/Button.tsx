import React from 'react'
import { Pressable, View, Text } from 'dripsy'
import { Link } from 'solito/link'

const Button = ({ as, children, ...props }) => (
  <Pressable as={as} {...props}>
    {children}
  </Pressable>
)

type TextButtonProps = {
  children: React.ReactNode
  style?: object
  textProps?: {
    style?: object
  }
  [key: string]: any
}

type ButtonLinkProps = TextButtonProps & {
  href: string
}

export const TextButton = ({
  as=Pressable,
  children,
  style,
  textProps,
  ...props
}: TextButtonProps) => {
  const defaultButtonStyle = {
    backgroundColor: 'blue', // Background color
    paddingX: 20, // Horizontal padding
    paddingY: 15, // Vertical padding
    borderRadius: 10, // Border radius
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    ...style, // Allow custom styles to be passed
  }

  const buttonTextStyle = {
    color: 'white', // Button text color
    fontSize: 18, // Button text font size
    textAlign: 'center',
    ...textProps?.style, // Allow custom styles to be passed
  }

  return (
    <Button as={as} sx={defaultButtonStyle} {...props}>
      <Text sx={buttonTextStyle} {...textProps}>
        {children}
      </Text>
    </Button>
  )
}

export const ButtonLink = ({
  href,
  children,
  style,
  textProps,
  ...props
}: ButtonLinkProps) => {
  return (
    <Link href={href}>
      <TextButton as={View} style={style} textProps={textProps} {...props}>
        {children}
      </TextButton>
    </Link>
  )
}
