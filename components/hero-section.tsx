"use client"

import { CheckCircle2, Circle, Clock, ListTodo, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Star className="h-4 w-4" />
              Organize sua vida com facilidade
            </div>
            
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Gerencie suas tarefas de forma{" "}
              <span className="text-primary">simples e eficiente</span>
            </h1>
            
            <p className="max-w-lg text-pretty text-lg text-muted-foreground">
              O Advanced ToDoList ajuda você a organizar suas tarefas, aumentar sua produtividade 
              e nunca mais esquecer de nada importante.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/cadastro">
                <Button size="lg" className="h-12 px-8 text-base font-semibold cursor-pointer">
                  Comece gratuitamente
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold cursor-pointer">
                  Já tenho conta
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Grátis para sempre</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Sem cartão de crédito</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-md">
              <Card className="border-2 border-border/50 bg-card p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-card-foreground">Minhas Tarefas</h3>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Hoje
                  </span>
                </div>
                
                <div className="space-y-3">
                  <TaskItem 
                    completed 
                    title="Finalizar relatório mensal" 
                    time="09:00"
                    priority="high"
                  />
                  <TaskItem 
                    completed 
                    title="Reunião com equipe de design" 
                    time="10:30"
                    priority="medium"
                  />
                  <TaskItem 
                    title="Revisar proposta comercial" 
                    time="14:00"
                    priority="high"
                  />
                  <TaskItem 
                    title="Enviar feedback do projeto" 
                    time="16:00"
                    priority="low"
                  />
                  <TaskItem 
                    title="Planejar sprint da próxima semana" 
                    time="17:30"
                    priority="medium"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
                  <span>2 de 5 concluídas</span>
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-2/5 rounded-full bg-primary" />
                  </div>
                </div>
              </Card>

              <div className="absolute -right-10 -top-10 z-10">
                <Card className="border border-border/50 bg-card p-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-card-foreground">Tarefa concluída!</p>
                      <p className="text-xs text-muted-foreground">Agora mesmo</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="absolute -bottom-12 -left-8 z-10">
                <Card className="border border-border/50 bg-card p-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <ListTodo className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-card-foreground">+40%</p>
                      <p className="text-xs text-muted-foreground">Produtividade</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TaskItem({ 
  completed = false, 
  title, 
  time,
  priority
}: { 
  completed?: boolean
  title: string
  time: string
  priority: "high" | "medium" | "low"
}) {
  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500"
  }

  return (
    <div className={`flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors ${completed ? "bg-muted/50" : "bg-card hover:bg-muted/30"}`}>
      {completed ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
      ) : (
        <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
      )}
      <div className="flex-1 min-w-0">
        <p className={`truncate text-sm ${completed ? "text-muted-foreground line-through" : "text-card-foreground"}`}>
          {title}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className={`h-2 w-2 rounded-full ${priorityColors[priority]}`} />
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {time}
        </div>
      </div>
    </div>
  )
}
