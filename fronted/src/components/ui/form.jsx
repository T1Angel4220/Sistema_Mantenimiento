import * as React from "react"
import { Label } from "./label"

const Form = React.forwardRef(({ className, ...props }, ref) => (
  <form ref={ref} {...props} />
))
Form.displayName = "Form"

const FormItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} {...props} />
))
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef(({ className, ...props }, ref) => (
  <Label ref={ref} {...props} />
))
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} {...props} />
))
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} {...props} />
))
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} {...props} />
))
FormMessage.displayName = "FormMessage"

const FormField = ({ name, ...props }) => (
  <div {...props} />
)

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
