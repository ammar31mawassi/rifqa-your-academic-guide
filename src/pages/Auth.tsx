import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Mail, Lock, User, Loader2 } from "lucide-react";
import { z } from "zod";
const loginSchema = z.object({
  email: z.string().trim().email({
    message: "البريد الإلكتروني غير صالح"
  }),
  password: z.string().min(6, {
    message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
  })
});
const signupSchema = z.object({
  fullName: z.string().trim().min(2, {
    message: "الاسم يجب أن يكون حرفين على الأقل"
  }).max(100),
  email: z.string().trim().email({
    message: "البريد الإلكتروني غير صالح"
  }),
  password: z.string().min(6, {
    message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
  }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"]
});
export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {
    signIn,
    signUp
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = loginSchema.safeParse(loginData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    const {
      error
    } = await signIn(loginData.email, loginData.password);
    setIsLoading(false);
    if (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        variant: "destructive"
      });
    } else {
      toast({
        title: "مرحباً بك!",
        description: "تم تسجيل الدخول بنجاح"
      });
      navigate("/");
    }
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = signupSchema.safeParse(signupData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    const {
      error
    } = await signUp(signupData.email, signupData.password, signupData.fullName);
    setIsLoading(false);
    if (error) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "تم إنشاء الحساب!",
        description: "يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب"
      });
    }
  };
  return <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center">
          <GraduationCap className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">دليلي
        </h1>
          <p className="text-sm text-muted-foreground">رفيقك الأكاديمي</p>
        </div>
      </div>

      <Card className="w-full max-w-md shadow-soft border-0">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl">أهلاً وسهلاً</CardTitle>
          <CardDescription>سجّل دخولك أو أنشئ حساباً جديداً</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">حساب جديد</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="login-email" type="email" placeholder="example@university.edu" className="pr-10" value={loginData.email} onChange={e => setLoginData({
                    ...loginData,
                    email: e.target.value
                  })} />
                  </div>
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="login-password" type="password" placeholder="••••••••" className="pr-10" value={loginData.password} onChange={e => setLoginData({
                    ...loginData,
                    password: e.target.value
                  })} />
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      جاري تسجيل الدخول...
                    </> : "تسجيل الدخول"}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">الاسم الكامل</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="signup-name" type="text" placeholder="أحمد محمد" className="pr-10" value={signupData.fullName} onChange={e => setSignupData({
                    ...signupData,
                    fullName: e.target.value
                  })} />
                  </div>
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="signup-email" type="email" placeholder="example@university.edu" className="pr-10" value={signupData.email} onChange={e => setSignupData({
                    ...signupData,
                    email: e.target.value
                  })} />
                  </div>
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="signup-password" type="password" placeholder="••••••••" className="pr-10" value={signupData.password} onChange={e => setSignupData({
                    ...signupData,
                    password: e.target.value
                  })} />
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">تأكيد كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="signup-confirm" type="password" placeholder="••••••••" className="pr-10" value={signupData.confirmPassword} onChange={e => setSignupData({
                    ...signupData,
                    confirmPassword: e.target.value
                  })} />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      جاري إنشاء الحساب...
                    </> : "إنشاء حساب"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <p className="mt-6 text-sm text-muted-foreground text-center">
        بتسجيلك، أنت توافق على شروط الاستخدام وسياسة الخصوصية
      </p>
    </div>;
}