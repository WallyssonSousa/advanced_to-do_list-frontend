import { CheckSquare } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <CheckSquare className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Advanced ToDoList</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="transition-colors hover:text-foreground">
              Sobre
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Recursos
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Preços
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Contato
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} Advanced ToDoList. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
