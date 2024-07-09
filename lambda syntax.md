# Syntax

Traditional

```
T := x | λx.T | T U | (T)

(λx.x)(λx.x)
```

"Normal" (the one I usually use)

```
T := x | x -> T | T . U | (T)
```

Novel

```
T := x | x {T} | T (U) | U <T>
```

Even better?

```
T := x | T λx | T (U) | U <T>
```

or flipped..

```
T := x | x -> T | (T) U | <U> T
```

Minimal!

```
T := x | T   | T x
       |   U |
```

# Explanation of the "Better" syntax

First of all, `x` simply allows us to introduce free variables.

Then, on arbitrary expressions, `T`, there are 3 possible (unary) operations:

- One is indexed by variables and uses the familiar `λ` as a seperator to avoid ambiguity without relying on whitespace
- The remaining two are indexed by arbitrary expressions, `U`, and require:
  - Distinguished opening/closing delimiters to unambiguously indicate the scope of the indexing expression  
    (**Importantly**, this provides a natural opportunity for indentation, the primary means by which tree-like code and data structures are made readable)
  - 2 distinguished _types_ of delimiters to indicate which of the two possible operations is being invoked

The 3 unary operations are as follows:

1. `λx` _bind_ all free variables, `x`, in the context, `T`
2. `(U)` _apply_ the context, `T`, to another expression, `U`
3. `<U>` _inject_ the context, `T`, into another expression, `U`

Here, the "context" refers to the fact that there are no explicit delimiters required (nor _allowed_) around the expression `T`, in the syntax above.

This encourages a highly streamlined and predictable way of reading and writing expressions in a way that is reminiscent of imperative code. (This similarly relies on the programmer's knowledge of the previous lines of code, in a given scope, to determine the semantic meaning of the current line).

# `EBNF` grammar

Novel syntax

```
<e> ::= <v> " {" <e> "}"
      | <e> " (" <e> ")"
      | <e> " <" <e> ">"
      | <v>

<v> ::= [a-z]
```

## Better syntax

```
<e> ::= <e> "λ" <v>
      | <e> "(" <e> ")"
      | <e> "<" <e> ">"
      | <v>

<v> ::= [a-z]
```

Better syntax (with newlines)

```
<e> ::= <e> "\nλ" <v>
      | <e> "\n(\n" <e> "\n)"
      | <e> "\n<\n" <e> "\n>"
      | <v>

<v> ::= [a-z]
```

Better syntax (with indenting) - not possible with EBNF because it's not context free

# Example: id id

Normal syntax

```
id = (x -> x)

id id =
(x -> x) . (x -> x)
```

Novel syntax

```
id = x {x}

id id =
x {x} (x {x})
```

Novel syntax, indented

```
id id =

x {
    x
}
(
    x {
        x
    }
)
```

Better syntax, indented

```
id id =

x
λx
(
    x
    λx
)
```

Flipped syntax

```
id id =

(
    x ->
    x
)
x ->
x
```

Minimal

```
x x
  x x

???
```

# Reduction rules

## Beta rule, using novel syntax

Every instance of `} (` (modulo whitespace) is reducible

```
x {T} (U)

=> T[x:=U]
```

Indented

```
x {
    T
}
(
    U
)

=> T[x:=U]
```

Better syntax - every instance of `λ x (` is reducible

```
T
λx (
    U
)

=> T[x:=U]
```

Flipped syntax - every `( x ->`

```
(
    x ->
    T
)
U

=> T[x:=U]
```

Minimal

```
T x
  U

=> T[x:=U]
```

## Beta rule, with reverse application

Every instance of `< x {` (modulo whitespace and variable name) is reducible

```
U <x {T}>

=> T[x:=U]
```

Indented

```
U
<
    x {
        T
    }
>

=> T[x:=U]
```

Better syntax - every instance of `λ x >` is reducible

```
U
<
    T
    λx
>

=> T[x:=U]
```

Flipped syntax - every `> x ->`

```
<
    U
>
x ->
T

=> T[x:=U]
```

# Example: "Local definitions"

Local definitions can be created, similar to `let x = U in T`, using a particular pattern of reverse application: `< x {`  
E.g.

```
U
< x {

V
< y {

T

}>}>

=> ≈T[x:=U, y:=V]
```

Better syntax - definitions given at bottom, equivalent to Haskell's `where` construct

```
let x = 1 in (T)
==
(λx.T) 1

var = arg
body

(λx.T) 1
(x.body) arg


T

λx (
    U
)

λy (
    V
)

=> ≈T[x:=U, y:=V]
```

Flipped syntax - has the best `let`

```
<
    U
> x ->

<
    V
> y ->

T

=> ≈T[x:=U, y:=V]
```

Minimal

```
T x
  U y
    V
```

# Example: Indentation

Random complicated example from `EBNF` generator

```
d (c {p {h} (r)}) <l {c <s {w {l}} <h>> <u> (b)}>
```

With indentation, structure becomes significantly clearer

```
d
(
    c {
        p {h}
        (r)
    }
)
<
    l {
        c
        <
            s {
                w {l}
            }
            <h>
        >
        <u>
        (b)
    }
>
```

Normal syntax: not noticably clearer than the non-indented novel syntax

```
(l -> (u . ((h . (s -> w -> l)) . c)) . b) . (d . (c -> ((p -> h) . r)))
```

Better syntax

```
d
(
    h
    λp
    (r)
    λc
)
<
    c
    <
        l
        λw
        λs
        <h>
    >
    <u>
    λl
>
```

Flipped syntax

```
<
    (d)
    c ->
    (
        p ->
        h
    )
    r
>
l ->
(
    <
        <c>
        <
            s ->
            w ->
            l
        >
        h
    >
    u
)
b
```

Novel with reverse apply removed

```
l {
    u
    (
        h
        (
            s {
                w {l}
            }
        )
        (c)
    )
    (b)
}
(
    d
    (
        c {
            p {h}
            (r)
        }
    )
)
```

Minimal - doesn't work because associativity ambiguity

```
u
    h

            c
                b l
```

# Indentation "rules"

- Modulo whitespace, delimiters `{}`, `<>`, `()`, exist on their own lines <br/> (_Exception_: binding variables with their opening scope: `x {`)
- Pairs of delimiters always contain indented code blocks <br/> (_Exception_: delimiters contain a single variable: `{x}`, `<y>`, `(z)`)
- Further exceptions can be made in intentionally <br/> E.g. for "local definitions" and "scope grouping"

# Example: S combinator

`S x y z = x z (y z)`

Normal synax

```
S = x -> y -> z -> x . z . (y . z)
```

Novel syntax

```
S =

x {
    y {
        z {
            x
            (z)
            (
                y
                (z)
            )
        }
    }
}
```

Alternative indentation: "scope grouping"

```
x { y { z {
    x
    (z)
    (
        y
        (z)
    )
}}}
```

Alternative application order: using reverse application

```
x { y { z {
    y
    (z)
    <
        x
        (z)
    >
}}}
```

Better syntax

```
y
(z)
<
    x
    (z)
>
λz
λy
λx
```

Flipped syntax

```
x ->
y ->
z ->
<
    (y)
    z
>
(x)
z
```

Minimal

```

```

# Reverse application

## Example 1: One function `f`, many arguments

Normal syntax

```
 a -> b -> c -> d -> f -> f . a . b . c . d
```

Novel syntax

```
a { b { c { d { f {
    f
    (a)
    (b)
    (c)
    (d)
}}}}}
```

Better syntax

```
f
(a)
(b)
(c)
(d)
λf
λd
λc
λb
λa
```

Flipped syntax

```
a ->
b ->
c ->
d ->
f ->
<d>
<c>
<b>
<a>
f
```

Minimal

```

```

## Example 2: One argument `a`, many functions

Normal syntax

```
a -> f -> g -> h -> j -> j . (h . (g . (f . a)))
```

Novel syntax

```
a { f { g { h { j {
    j
    (
        h
        (
            g
            (
                f (a)
            )
        )
    )
}}}}}
```

Novel syntax (using reverse application)

```
a { f { g { h { j {
    a
    <f>
    <g>
    <h>
    <j>
}}}}}
```

Better syntax

```
a
<f>
<g>
<h>
<j>
λj
λh
λg
λf
λa
```

Flipped syntax

```
a ->
f ->
g ->
h ->
j ->
(j)
(h)
(g)
(f)
a
```

Minimal

```

```

# Example: Calculating 2 + 3 with scott-encoding

Normal syntax

```
(\zero ->
(\plusOne ->
(\add ->
(\two ->
(\three ->

add two three

) (plusOne two)
) (plusOne (plusOne zero))
) (\n m -> n plusOne m)
) (\n s z -> s (n s z))
) (\s z -> z)
```

Novel syntax

```
s { z {
    z
}}
< zero {

n { s { z {
    n
    (s)
    (z)
    <s>
}}}
< plusOne {

n { m {
    n
    (plusOne)
    (m)
}}
< add {

zero
<plusOne>
<plusOne>
< two {

two
<plusOne>
< three {

two
<add>
(three)

}>}>}>}>}>
```

Consists mostly of definitions, same as the normal syntax, but they are grouped locally, using reverse application  
E.g. the definition of `add` is in one contiguous chunk:

```
n { m {
    n
    (plusOne)
    (m)
}}
< add {
```

Reverse application allows infix-like usage of `add` in the final computation:

```
two
<add>
(three)
```

Better syntax

```
2 <+> (3)

λ3 (
    2 <+1>
)

λ2 (
    0 <+1> <+1>
)

λ+ (
    n
    (+1)
    (m)
    λm λn
)

λ+1 (
    n
    (s)
    (z)
    <s>
    λz λs λn
)

λ0 (
    z
    λz λs
)
```

Flipped Syntax

```
<
    z ->
    s ->
    z
> zero ->

<
    n ->
    s ->
    z ->
    (s)
    <z>
    <s>
    n
> plusOne ->

<
    n ->
    m ->
    <m>
    <plusOne>
    n
> add ->

<
    (plusOne)
    (plusOne)
    zero
> two ->

<
    (plusOne)
    two
> three ->

<three>
(add)
two
```

Minimal

```

```

# Annihilation

Better syntax - consider evaluation of this:

```
T
... λe λd λc λb λa (A) (B) (C) (D) (E) ...
```

Here we go:

```
   T
   ... λe λd λc λb λa (A) (B) (C) (D) (E) ...

=> T[a:=A]
      ... λe λd λc λb (B) (C) (D) (E) ...

=> T[a:=A][b:=B]
         ... λe λd λc (C) (D) (E) ...

=> T[a:=A][b:=B][c:=C]
            ... λe λd (D) (E) ...

=> T[a:=A][b:=B][c:=C][d:=D]
               ... λe (E) ...

=> T[a:=A][b:=B][c:=C][d:=D][e:=E]
                    ...
```

# Thoughts

I prefer "Better" because it removes unnecessary scope indentation and because it's more consistent in that all 3 operators become unary and dependent on the existing context on previous lines (wihin existing term scope, i.e. within delimiters, if any) to determine the first value `T`

I also prefer "Better" over "Flipped" in spite of the requirement to state arguments in reverse order (right-to-left) and (bottom-to-top), and to define function bodies before their binders, and to give definitions after their references, simply because of how unintuitive it is to have to consider "everything that happens after this line, in this scope" as the context for something happening on the _current_ line. This is exactly opposite to the context build-up in scope blocks that exists for imperative languages, which exactly what "Better" is exploiting.

Also, at the very least, the requirement to bind variables after their references can be justified when one thinks less explicitly in terms of defining functions and more explicitly in terms of binding free variables (as and when that is deemed necessary, computationally speaking) otherwise free variables are perfectly fine to stand on their own, as an atom to be computed with and with some symbolic meaning for the programmer.

# Parsing

Better syntax

```
T := x | T λx | T (U) | U <T>
```

Parsing-wise:

```
T := x | T λ x | T ( U ) | U < T >
```

Delimitation is easy, requiring no whitespace.  
Variables `x` match on consecutive non-keysymbols.  
Whitespace is sucked into variable names, I guess???

Whitespace is _preserved_ which requires (possibly elaborate) determination of which whitespace, in some sense, belongs to which expression. This is important for preservation of the structure determined by the programmer (to aid their understanding) when substitutions take place.

In particular, indentation conventions should be preserved which actually poses a complex problem since naive textual substitution does not correct indentation, where it exists, nor is its existence necessitated by parsing.

For example, it's entirely possible for someone to break their own indenting convention with the following code:

```
x
(
    a
    b
c
    d
)
```

In some sense, since we still want to allow programmers to use arbitrary whitespace at the beginning of lines, even when in an indented block, it seems reasonable to take the "indentation level" of the current block to be the _minimum_ of any lines in that block and perform substitution accordingly.

This requires programmers to be diligent, but this seems like a reasonable compromise for having a robust tool.
This can also be true at the top-level without issue.

- Keysymbols: `λ`, `(`, `)`, `<`, `>`
- Whitespace: Unicode standard?
- Everything else

# Features

- local definitions
- scott-encoding algebraic datatypes
- functions on them (pattern matching, without the patterns)
- singly recursive definitions (Y combinator)
- mutually recursive definitions

```
data [a] = []
         | a:[a]

zip :: [a] -> [b] -> [(a,b)]
zip [] _ = []
zip _ [] = []
zip (a:as) (b:bs) = (a,b):(zip as bs)
```

```
...
λzip (
    ...
    <
        zip
        (as)
        (bs)
    >
    λbs
    λas
)
λzip (...)


Y f => f (Y f) => f (f (Y f)) => 5

Y = λf -> (λx -> f . (x . x)) . (λx -> f . (x . x))
    λf -> f . ((λx -> f . (x . x)) . (λx -> f . (x . x)))
    λf -> f . (f . ((λx -> f . (x . x)) . (λx -> f . (x . x))))
    ...
    λf -> f . (f . (f . (f . (f . (f . (f . (f . (f . (f . (f . (f ...)))))))))))
```

```
myprogram.hs

myfunction1 = ...myfunction2...myfunction3

myfunction2 = myfunction1.. myfunction2 .. myfunciton3

myfunction3 = myfunction2..
```

```
data MyType = ThisThing Int Bool String | ThisOtherThing Bool Bool | ThisThirdThing String Int

data Bool = True | False
data List a = Empty | Head a (List a)
data Tree a = Empty | Node a | Branch (Tree a) (Tree a)

addtoleft :: a -> Tree a -> Tree a
addtoleft a Empty = ...
addtoleft a n = ...
addtoleft a (Branch t1 t2) = ...
```

# TODO

- Trivial implementation of parser and evaluator
  - Naive about whitespace, gets sucked into variable names
  - Splits _only_ on 5 key symbols, does not store these symbols
  - Allows variable shadowing but _does not_ implement capture avoidance
  - Allows but does not correct for indentation
  - No animation yet
  - Implements normal order evaluation
  - Handles reverse application in a primitive way rather than rewriting to normal application
  - Because of the syntactic structure, collapsing the tree structure back into a single string (including the latent whitespace) should be trivial

## Wait! You can't include whitespace in variable names because that would break the semantic association when the whitespace isn't lining up correctly

### You should instead allow whitespace to be included to right of _variables only_

And you should eat (preserve) all the left-most whitespace of the entire document seperately
