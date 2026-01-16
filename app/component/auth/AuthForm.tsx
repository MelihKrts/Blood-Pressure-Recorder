import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import Link from "next/link"
import {FormField} from "@/app/component/shared/FormField";
import React from "react";

interface AuthFormProps {
    title: string,
    buttonText: string,
    loading: boolean,
    linkText: string,
    linkHref: string,
    email: string,
    setEmail: (val: string) => void,
    password: string,
    setPassword: (val: string) => void,
    onSubmit: (e: React.FormEvent) => void,
    errors?: { email?: string, password?: string },
}

export function AuthForm({title, buttonText, loading, linkText, linkHref, email, setEmail, password, setPassword, errors, onSubmit}: AuthFormProps) {
    return (
        <section className="w-full">
            <div className="@container">
                <div className="mx-auto w-2/5 @3xs:@max-3xl:w-full @3xl:@max-7xl:w-3/4  p-4">
                    <Card className="w-full ">
                        <CardHeader>
                            <CardTitle className="text-2xl text-center">{title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={onSubmit} className="space-y-4">

                                <FormField id="email" label="E-posta" type="email" value={email}
                                           onChange={(e) => setEmail(e.target.value)} error={errors?.email}/>

                                <FormField id="password" label="Şifre" type="password" value={password}
                                           onChange={(e) => setPassword(e.target.value)} error={errors?.password}/>

                                <Button className="w-1/3 flex m-auto" type="submit" disabled={loading}>
                                    {loading ? "İşlem Yapılıyor..." : buttonText}
                                </Button>

                            </form>
                        </CardContent>

                        <CardFooter className="justify-center">
                            <Link href={linkHref} className="text-sm text-blue-600">
                                {linkText}
                            </Link>
                        </CardFooter>

                    </Card>
                </div>
            </div>
        </section>
    )
}