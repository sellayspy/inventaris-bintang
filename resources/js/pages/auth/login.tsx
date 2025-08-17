import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    name: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        name: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Selamat Datang" description="Silahkan login terlebih dahulu">
            <Head title="Login" />

            <form className="mt-8 space-y-4" onSubmit={submit}>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Masukan Nama
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Masukan nama"
                            className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-lg border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700/50"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Masukan Password
                            </Label>
                            {canResetPassword && (
                                <TextLink
                                    href={route('password.request')}
                                    className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 text-sm"
                                    tabIndex={3}
                                >
                                    Lupa password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Masukan password anda"
                            className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-lg border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700/50"
                        />
                    </div>

                    <div className="flex items-center">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                            className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700/50"
                        />
                        <Label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Ingat saya
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 flex w-full justify-center rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="flex items-center">
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Memproses...
                            </span>
                        ) : (
                            'Masuk'
                        )}
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
