"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { setClientCookie } from "@/lib/cookie.client";

import { PasswordStrength } from "./password-strength";

export function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = useMemo(
    () =>
      z
        .object({
          email: z.email({ message: t("form.emailInvalid") }),
          password: z
            .string()
            .min(8, { message: t("form.passwordTooShort") })
            .regex(/[A-Z]/, { message: t("form.passwordNoUppercase") })
            .regex(/[a-z]/, { message: t("form.passwordNoLowercase") })
            .regex(/[0-9]/, { message: t("form.passwordNoNumber") })
            .regex(/[^A-Za-z0-9]/, { message: t("form.passwordNoSpecial") }),
          confirmPassword: z.string().min(1, { message: t("form.confirmPasswordTooShort") }),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("form.passwordsDoNotMatch"),
          path: ["confirmPassword"],
        }),
    [t],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = form.watch("password");

  function onSubmit(_data: z.infer<typeof formSchema>) {
    setClientCookie("demo-auth", "1", 1);
    toast.success(t("form.registerSuccess"));
    router.push("/dashboard/chat");
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FieldGroup className="gap-4">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-email">{t("form.emailLabel")}</FieldLabel>
              <Input
                {...field}
                id="register-email"
                type="email"
                placeholder={t("form.emailPlaceholder")}
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-password">{t("form.passwordLabel")}</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      className="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      className="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              <PasswordStrength password={watchedPassword} />
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-confirm-password">{t("form.confirmPasswordLabel")}</FieldLabel>
              <Input
                {...field}
                id="register-confirm-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button className="w-full" type="submit">
        {t("register")}
      </Button>
    </form>
  );
}
