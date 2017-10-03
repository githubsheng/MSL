/**
 *
 * We reference Java byte code commands. In Java there is no dedicated command for "and operator"/"or operator", consider the "and operator",
 * What you're effectively evaluating is:
 *
 * if (left)
 * if (right) <do something>
 * endIf
 * How could you model this using labels and conditional branching? Well, you could do this:

 * .start
 * <left expression>
 * IFEQ .endIf // if left evaluates to zero (false), skip to end
 * <right expression>
 * IFEQ .endIf // if right evaluates to zero (false), skip to end
 * .ifTrue
 * <body of 'if' block>
 * .endIf:
 * The behavior of the || operator is a bit different; in this case, the logic looks something like this:

 * if (left)
 * goto .ifTrue
 * if (!right)
 * goto .endIf
 * .ifTrue
 * <do something>
 * .endIf
 *
 */
package DLS.CommandGenerator.commands.logical;