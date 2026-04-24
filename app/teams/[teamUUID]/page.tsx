"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { useAuth } from "@/lib/auth-context"
import { useTeamDetails } from "@/hooks/useTeamDetails"
import { leaveTeam } from "@/services/teamService"
import { AddUserForm } from "./AddUserForm"
import { TeamSettingsForm } from "./TeamSettingsForm"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { ArrowLeft, Crown, LogOut, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

type ColumnId = "todo" | "inprogress" | "done"

interface Task {
  id: string
  title: string
  description?: string
  tag?: string
  priority?: "low" | "medium" | "high"
  assigneeInitials?: string
}

const INITIAL_TASKS: Record<ColumnId, Task[]> = {
  todo: [
    {
      id: "t1",
      title: "Redesenhar página inicial",
      description: "Atualizar seção principal e proposta de valor",
      tag: "Frontend",
      priority: "high",
      assigneeInitials: "WA",
    },
    {
      id: "t2",
      title: "Configurar pipeline CI/CD",
      description: "Usar GitHub Actions com deploy em staging",
      tag: "Backend",
      priority: "medium",
      assigneeInitials: "WS",
    },

    // FRONTEND
    {
      id: "t8",
      title: "Alterar cor do botão principal",
      description: "Trocar cor para azul padrão do sistema",
      tag: "Frontend",
      priority: "low",
    },
    {
      id: "t9",
      title: "Adicionar cursor pointer",
      description: "Aplicar cursor-pointer nos botões clicáveis",
      tag: "Frontend",
      priority: "low",
    },
    {
      id: "t10",
      title: "Ajustar padding do card",
      description: "Padronizar espaçamento interno dos cards",
      tag: "Frontend",
      priority: "low",
    },

    // BACKEND
    {
      id: "t11",
      title: "Ajustar retorno de usuários",
      description: "Adicionar listagem de usuários no retorno da API",
      tag: "Backend",
      priority: "medium",
    },
    {
      id: "t12",
      title: "Corrigir validação de payload",
      description: "Ajustar validação no endpoint de criação",
      tag: "Backend",
      priority: "medium",
    },
    {
      id: "t13",
      title: "Adicionar campo status",
      description: "Incluir status no retorno das tarefas",
      tag: "Backend",
      priority: "low",
    },
  ],

  inprogress: [
    {
      id: "t4",
      title: "Limitação de requisições da API",
      description: "Implementar algoritmo de token bucket",
      tag: "Backend",
      priority: "high",
      assigneeInitials: "WS",
    },
    {
      id: "t5",
      title: "Responsividade mobile",
      description: "Corrigir breakpoints para tablet e mobile",
      tag: "Frontend",
      priority: "medium",
      assigneeInitials: "WA",
    },

    {
      id: "t14",
      title: "Ajustar input de busca",
      description: "Corrigir debounce na busca",
      tag: "Frontend",
      priority: "low",
    },
    {
      id: "t15",
      title: "Refatorar endpoint de login",
      description: "Melhorar tratamento de erros",
      tag: "Backend",
      priority: "medium",
    },
  ],

  done: [
    {
      id: "t6",
      title: "Migrações de banco de dados",
      description: "Schema v2 do PostgreSQL implantado",
      tag: "Backend",
      priority: "high",
      assigneeInitials: "WS",
    },
    {
      id: "t7",
      title: "Fluxo de onboarding",
      tag: "Frontend",
      priority: "medium",
    },

    {
      id: "t16",
      title: "Ajustar hover de botão",
      description: "Adicionar efeito hover nos botões",
      tag: "Frontend",
      priority: "low",
    },
    {
      id: "t17",
      title: "Criar endpoint de usuários",
      description: "Retornar lista básica de usuários",
      tag: "Backend",
      priority: "medium",
    },
  ],
};

const COLUMNS: { id: ColumnId; label: string; dotClass: string }[] = [
  { id: "todo", label: "To Do", dotClass: "bg-muted-foreground/50" },
  { id: "inprogress", label: "In Progress", dotClass: "bg-primary" },
  { id: "done", label: "Done", dotClass: "bg-green-500" },
]

const PRIORITY_CLASSES: Record<string, string> = {
  high: "text-destructive border-destructive/30 bg-destructive/10",
  medium: "text-yellow-600 dark:text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  low: "text-muted-foreground border-border bg-muted/50",
}

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-indigo-500",
]

function getAvatarColor(seed: string) {
  return AVATAR_COLORS[seed.charCodeAt(0) % AVATAR_COLORS.length]
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

export default function TeamPage() {
  const { teamUUID } = useParams<{ teamUUID: string }>()
  const router = useRouter()

  const { user } = useAuth()
  const { users, isLoading, refresh } = useTeamDetails(teamUUID)

  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [dragging, setDragging] = useState<{ taskId: string; fromCol: ColumnId } | null>(null)
  const [dragOver, setDragOver] = useState<ColumnId | null>(null)

  useEffect(() => {
    if (!user) router.push("/login")
  }, [user, router])

  const handleLeave = async () => {
    await leaveTeam(teamUUID, {})
    router.push("/dashboard")
  }

  const handleDragStart = (e: React.DragEvent, taskId: string, fromCol: ColumnId) => {
    setDragging({ taskId, fromCol })
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, colId: ColumnId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOver(colId)
  }

  const handleDrop = (e: React.DragEvent, toCol: ColumnId) => {
    e.preventDefault()
    if (!dragging || dragging.fromCol === toCol) {
      setDragging(null)
      setDragOver(null)
      return
    }
    setTasks((prev) => {
      const task = prev[dragging.fromCol].find((t) => t.id === dragging.taskId)
      if (!task) return prev
      return {
        ...prev,
        [dragging.fromCol]: prev[dragging.fromCol].filter((t) => t.id !== dragging.taskId),
        [toCol]: [...prev[toCol], task],
      }
    })
    setDragging(null)
    setDragOver(null)
  }

  const handleDragEnd = () => {
    setDragging(null)
    setDragOver(null)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-5" />

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Team Board</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AddUserForm teamUUID={teamUUID} onSuccess={refresh} />
            <TeamSettingsForm teamUUID={teamUUID} />
            <Separator orientation="vertical" className="mx-1 h-5" />
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={handleLeave}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="border-b bg-gradient-to-b from-muted/40 to-background">
        <div className="container mx-auto flex items-end justify-between px-6 py-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Sprint atual</h1>
            <p className="text-sm text-muted-foreground">
              Arraste os cards entre as colunas para atualizar o status.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />
              {tasks.todo.length} pendentes
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {tasks.inprogress.length} em progresso
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {tasks.done.length} concluídos
            </span>
          </div>
        </div>
      </div>

      <main className="container mx-auto flex gap-6 px-6 py-8">
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-3 gap-4">
            {COLUMNS.map((col) => {
              const isDropTarget = dragOver === col.id && dragging?.fromCol !== col.id

              return (
                <div
                  key={col.id}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={cn(
                    "flex flex-col rounded-xl border bg-card/50 transition-all duration-150",
                    isDropTarget && "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                  )}
                >
                  <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", col.dotClass)} />
                      <span className="text-sm font-semibold">{col.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {tasks[col.id].length}
                    </Badge>
                  </div>

                  <div className="min-h-[360px] flex-1 space-y-2.5 p-3">
                    {tasks[col.id].map((task) => (
                      <Card
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id, col.id)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          "cursor-grab select-none border-border/50 bg-card p-3.5",
                          "transition-all duration-150 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5",
                          "active:cursor-grabbing",
                          dragging?.taskId === task.id && "opacity-40 scale-95"
                        )}
                      >
                        {(task.tag || task.priority) && (
                          <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                            {task.tag && (
                              <Badge variant="secondary" className="text-[10px]">
                                {task.tag}
                              </Badge>
                            )}
                            {task.priority && (
                              <span
                                className={cn(
                                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize",
                                  PRIORITY_CLASSES[task.priority]
                                )}
                              >
                                {task.priority}
                              </span>
                            )}
                          </div>
                        )}

                        <p className="text-sm font-semibold leading-snug text-card-foreground">
                          {task.title}
                        </p>

                        {task.description && (
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {task.description}
                          </p>
                        )}

                        {task.assigneeInitials && (
                          <div className="mt-3 flex justify-end">
                            <div
                              className={cn(
                                "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white",
                                getAvatarColor(task.assigneeInitials)
                              )}
                            >
                              {task.assigneeInitials}
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}

                    {isDropTarget && (
                      <div className="flex h-14 items-center justify-center rounded-lg border-2 border-dashed border-primary/40 bg-primary/5">
                        <span className="text-xs font-medium text-primary/70">Soltar aqui</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <aside className="w-[220px] shrink-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Membros</h2>
            <Badge variant="secondary" className="text-xs">
              {users.length}
            </Badge>
          </div>

          <Separator className="mb-4" />

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[68px] animate-pulse rounded-xl border bg-muted/30"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((member) => (
                <Card
                  key={member.uuid}
                  className={cn(
                    "relative border-border/50 bg-card/50 px-3.5 py-3 transition-all hover:border-primary/40 hover:shadow-sm",
                    member.isAdmin && "pt-4"
                  )}
                >
                  {member.isAdmin && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <div className="rounded-full bg-background px-0.5">
                        <Crown className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                        getAvatarColor(member.name)
                      )}
                    >
                      {getInitials(member.name)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold leading-tight">
                        {member.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {member.isAdmin ? (
                          <span className="font-medium text-yellow-500 dark:text-yellow-400">
                            Admin
                          </span>
                        ) : (
                          "Membro"
                        )}
                      </p>
                    </div>

                    <div className="ml-auto h-2 w-2 shrink-0 rounded-full bg-green-500 ring-2 ring-background" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </aside>
      </main>
    </div>
  )
}