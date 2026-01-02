# Como Adicionar Imagens dos Filmes/Séries 🖼️

## Opção 1: Imagens Locais (Recomendado)

1. Baixe os posters dos filmes/séries do MCU
2. Salve as imagens na pasta `public/images/`
3. Nomeie os arquivos exatamente como especificado em [data/mcu-data.ts](data/mcu-data.ts)

Exemplo de estrutura:
```
public/images/
├── iron-man.jpg
├── hulk.jpg
├── captain-marvel.jpg
├── avengers.jpg
└── ...
```

## Opção 2: Usar API do The Movie Database (TMDB)

1. Crie uma conta gratuita em [themoviedb.org](https://www.themoviedb.org/)
2. Obtenha sua API key
3. Modifique o arquivo `data/mcu-data.ts` para usar URLs do TMDB:

```typescript
imageUrl: 'https://image.tmdb.org/t/p/w500/caminho-do-poster.jpg'
```

## Opção 3: Placeholder Dinâmico (Atual)

O site atualmente usa ícones como placeholder:
- 🎬 Ícone de filme para movies
- 📺 Ícone de TV para séries

Esta é a configuração atual e não requer nenhuma imagem adicional.

## Recomendações de Imagens

- **Formato**: JPG ou PNG
- **Resolução**: 500x750px (proporção 2:3)
- **Tamanho**: Menos de 200KB por imagem
- **Qualidade**: Alta definição para melhor experiência visual

## Lista de Nomes de Arquivos Necessários

Aqui está a lista completa de nomes de arquivos que você precisa criar na pasta `public/images/`:

1. `iron-man.jpg` - Homem de Ferro
2. `hulk.jpg` - O Incrível Hulk
3. `iron-man-2.jpg` - Homem de Ferro 2
4. `thor.jpg` - Thor
5. `cap-america-1.jpg` - Capitão América: O Primeiro Vingador
6. `avengers.jpg` - Os Vingadores
7. `iron-man-3.jpg` - Homem de Ferro 3
8. `thor-2.jpg` - Thor: O Mundo Sombrio
9. `cap-america-2.jpg` - Capitão América: O Soldado Invernal
10. `guardians.jpg` - Guardiões da Galáxia
11. `age-ultron.jpg` - Vingadores: Era de Ultron
12. `ant-man.jpg` - Homem-Formiga
13. `civil-war.jpg` - Capitão América: Guerra Civil
14. `black-widow.jpg` - Viúva Negra
15. `black-panther.jpg` - Pantera Negra
16. `spider-man-1.jpg` - Homem-Aranha: De Volta ao Lar
17. `doctor-strange.jpg` - Doutor Estranho
18. `thor-3.jpg` - Thor: Ragnarok
19. `ant-man-2.jpg` - Homem-Formiga e a Vespa
20. `infinity-war.jpg` - Vingadores: Guerra Infinita
21. `endgame.jpg` - Vingadores: Ultimato
22. `loki.jpg` - Loki - Temporada 1
23. `what-if.jpg` - What If...? - Temporada 1
24. `spider-man-2.jpg` - Homem-Aranha: Longe de Casa
25. `wandavision.jpg` - WandaVision
26. `falcon.jpg` - Falcão e o Soldado Invernal
27. `shang-chi.jpg` - Shang-Chi e a Lenda dos Dez Anéis
28. `eternals.jpg` - Eternos
29. `hawkeye.jpg` - Gavião Arqueiro
30. `spider-man-3.jpg` - Homem-Aranha: Sem Volta Para Casa
31. `moon-knight.jpg` - Cavaleiro da Lua
32. `doctor-strange-2.jpg` - Doutor Estranho no Multiverso da Loucura
33. `ms-marvel.jpg` - Ms. Marvel
34. `thor-4.jpg` - Thor: Amor e Trovão
35. `she-hulk.jpg` - Mulher-Hulk: Defensora de Heróis
36. `werewolf.jpg` - Lobisomem na Noite
37. `black-panther-2.jpg` - Pantera Negra: Wakanda Para Sempre
38. `guardians-holiday.jpg` - Guardiões da Galáxia: Especial de Festas
39. `quantumania.jpg` - Homem-Formiga e a Vespa: Quantumania
40. `guardians-3.jpg` - Guardiões da Galáxia Vol. 3
41. `secret-invasion.jpg` - Invasão Secreta
42. `loki-s2.jpg` - Loki - Temporada 2
43. `the-marvels.jpg` - As Marvels
44. `what-if-s2.jpg` - What If...? - Temporada 2
45. `echo.jpg` - Echo
46. `deadpool-3.jpg` - Deadpool & Wolverine
47. `agatha.jpg` - Agatha Desde Sempre
48. `cap-america-4.jpg` - Capitão América: Admirável Mundo Novo
49. `thunderbolts.jpg` - Thunderbolts*
50. `fantastic-four.jpg` - Quarteto Fantástico: Primeiros Passos
51. `daredevil.jpg` - Demolidor: Renascido
52. `ironheart.jpg` - Ironheart
53. `doomsday.jpg` - Vingadores: Doomsday
54. `captain-marvel.jpg` - Capitã Marvel

## Fontes para Baixar Posters

- [The Movie Database (TMDB)](https://www.themoviedb.org/)
- [IMDb](https://www.imdb.com/)
- Google Images (busque por "MCU poster high quality")
- [Marvel.com](https://www.marvel.com/)

Após adicionar as imagens, o site automaticamente vai carregá-las!
