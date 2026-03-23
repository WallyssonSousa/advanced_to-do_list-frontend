import { Calendar, CheckCircle2, Clock, Layout, Shield, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Layout,
    title: "Interface Intuitiva",
    description: "Design limpo e fácil de usar para que você se concentre no que importa: suas tarefas."
  },
  {
    icon: Calendar,
    title: "Organização por Datas",
    description: "Organize suas tarefas por dia, semana ou mês. Nunca perca um prazo importante."
  },
  {
    icon: Zap,
    title: "Rápido e Eficiente",
    description: "Adicione, edite e conclua tarefas em segundos. Otimizado para produtividade máxima."
  },
  {
    icon: CheckCircle2,
    title: "Acompanhe seu Progresso",
    description: "Visualize estatísticas e acompanhe sua evolução ao longo do tempo."
  },
  {
    icon: Clock,
    title: "Lembretes Inteligentes",
    description: "Receba notificações para nunca esquecer de suas tarefas importantes."
  },
  {
    icon: Shield,
    title: "Seguro e Privado",
    description: "Seus dados estão protegidos com criptografia de ponta a ponta."
  }
]

export function FeaturesSection() {
  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Tudo que você precisa para{" "}
            <span className="text-primary">se organizar</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Recursos pensados para aumentar sua produtividade e simplificar seu dia a dia.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card 
              key={feature.title} 
              className="border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
