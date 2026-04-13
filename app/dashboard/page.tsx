"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import {
  CheckSquare,
  LogOut,
  Moon,
  Sun,
  Users,
  Plus,
  ArrowRight,
  Settings2,
  Sparkles,
  Shield,
  Hash,
} from "lucide-react"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { useAuth } from "@/lib/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

import { useTeams } from "@/hooks/useTeam"
import { createTeam } from "@/services/teamService"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const TEAM_COLORS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-600",
]

function getTeamColor(index: number) {
  return TEAM_COLORS[index % TEAM_COLORS.length]
}

function getTeamInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const { teams, isLoading: loadingTeams, refresh } = useTeams()

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: "", description: "" })
  const [hoveredTeam, setHoveredTeam] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleCreateTeam = async () => {
    if (!user || !form.name.trim()) return
    await createTeam({ ...form, userUUID: user.uuid })
    setOpen(false)
    setForm({ name: "", description: "" })
    refresh()
  }

  if (isLoading || loadingTeams) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 animate-pulse">
            <CheckSquare className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  const firstName = user.name?.split(" ")[0] ?? "Usuário"

  return (
    <div className="flex min-h-screen flex-col bg-background">

      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary transition-transform group-hover:scale-110">
              <CheckSquare className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">TaskFlow</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 cursor-pointer"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            </Button>

            <Separator orientation="vertical" className="h-5" />

            <div className="flex items-center gap-2.5 pl-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {firstName[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                {firstName}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="border-b bg-gradient-to-b from-muted/40 to-background">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary">Bem-vindo de volta</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                Olá, {firstName}
              </h1>
              <p className="text-muted-foreground text-base">
                Selecione um team para continuar ou crie um novo.
              </p>
            </div>

            <Button
              onClick={() => setOpen(true)}
              size="lg"
              className="gap-2 shrink-0 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Novo Team
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 py-10">
        <div className="container mx-auto px-6">

          {teams.length > 0 && (
            <div className="mb-8 flex items-center gap-3">
              <Badge variant="secondary" className="gap-1.5 py-1 px-3 text-sm">
                <Hash className="h-3.5 w-3.5" />
                {teams.length} {teams.length === 1 ? "team" : "teams"}
              </Badge>
            </div>
          )}

          {teams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 mb-6">
                <Users className="h-9 w-9 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nenhum team ainda</h3>
              <p className="text-muted-foreground text-sm max-w-xs mb-8">
                Crie seu primeiro team para começar a organizar tarefas com sua equipe.
              </p>
              <Button onClick={() => setOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar primeiro team
              </Button>
            </div>
          ) : (

            /* GRID */
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team, index) => {
                const isHovered = hoveredTeam === team.uuid
                const color = getTeamColor(index)
                const initials = getTeamInitials(team.name)

                return (
                  <Card
                    key={team.uuid}
                    className={`
                      group relative overflow-hidden border transition-all duration-200
                      ${isHovered
                        ? "border-primary/40 shadow-lg shadow-primary/5 -translate-y-0.5"
                        : "hover:border-border/80"
                      }
                    `}
                    onMouseEnter={() => setHoveredTeam(team.uuid)}
                    onMouseLeave={() => setHoveredTeam(null)}
                  >
                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white text-sm font-bold shadow-sm`}>
                          {initials}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/teams/${team.uuid}/settings`)
                          }}
                          title="Configurar team"
                        >
                          <Settings2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="pt-1 space-y-1">
                        <CardTitle className="text-base leading-snug">
                          {team.name}
                        </CardTitle>
                        {team.description && (
                          <CardDescription className="text-sm line-clamp-2">
                            {team.description}
                          </CardDescription>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 pb-4">
                      <Separator className="mb-4" />

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Shield className="h-3.5 w-3.5" />
                          <span>
                            {team.responsavel === user.uuid ? "Administrador" : "Membro"}
                          </span>
                        </div>

                        <Button
                          size="sm"
                          className="gap-1.5 h-8 text-xs cursor-pointer"
                          onClick={() => router.push(`/teams/${team.uuid}`)}
                        >
                          Entrar
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              <Card
                className="cursor-pointer border-dashed border-2 border-muted-foreground/20 bg-transparent hover:border-primary/40 hover:bg-muted/30 transition-all duration-200 flex items-center justify-center min-h-[160px]"
                onClick={() => setOpen(true)}
              >
                <div className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-primary py-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-dashed border-current">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">Novo team</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-1">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">Criar novo team</DialogTitle>
            <DialogDescription>
              Dê um nome e descrição para identificar seu time.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className="space-y-4 pt-1">
            <div className="space-y-2">
              <Label htmlFor="team-name">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                id="team-name"
                placeholder="Ex: Frontend, Design, Produto..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleCreateTeam()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-desc">Descrição</Label>
              <Textarea
                id="team-desc"
                placeholder="O que esse time faz ? (opcional)"
                className="resize-none"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={handleCreateTeam}
              disabled={!form.name.trim()}
            >
              <Plus className="h-4 w-4" />
              Criar team
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}