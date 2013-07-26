AVLTree
=======

A JavaScript module implementing an Adelson-Velskii and Landis' tree in JavaScript.

## Constructor Summary

<table>
	<tr>
		<th>Constructor</th>
		<th>Description</th>
		<th>Version Introduced</th>
	</tr>
	<tr>
		<td>AVLTree(comparator)</td>
		<td>Creates an empty AVL Tree. Comparator is optional, but if supplied it should be a function which takes two variables (a, b) and return value &lt; 0 if a is less than b, return &gt; 0 if a is greater than b or return a 0 if equal or as a default. For numbers, you can simply return a-b within the function.</td>
		<td>2.0.0</td>
	</tr>
</table>

## Method Summary

<table>
	<tr>
		<th>Return</th>
		<th>Method Name</th>
		<th>Method Description</th>
		<th>Version Introduced</th>
	</tr>
	<tr>
		<td>Boolean</td>
		<td>add(value)</td>
		<td>Inserts a node into the tree with the specified value if its not a  duplicate. If the value is inserted, the tree is balanced to enforce the AVL-Tree height property. False is returned if the vale is not inserted.</td>
		<td>2.0.0</td>
	</tr>
	<tr>
		<td>*</td>
		<td>remove(value)</td>
		<td>Removes a node from the tree with the specified value if it exists. If a node is removed the tree is balanced again. The value of the removed node is returned or null.</td>
		<td>2.0.0</td>
	</tr>
	<tr>
		<td>Boolean</td>
		<td>contains(value)</td>
		<td>Returns true if the tree contains a node with the specified value, false otherwise.</td>
		<td>2.0.0</td>
	</tr>
	<tr>
		<td>Number</td>
		<td>getCount(key)</td>
		<td>Returns the number of values stored in the tree.</td>
		<td>2.0.0</td>
	</tr>
	<tr>
		<td>Number</td>
		<td>getNthValue(n)</td>
		<td>Returns an n-th smallest value, based on the comparator where 0 &lt;= n &lt; this.getCount().</td>
		<td>2.0.0</td>
	</tr>
	<tr>
		<td>*</td>
		<td>getMinimum()</td>
		<td>Returns the smallest value in the tree.</td>
		<td>2.0.0</td>
	</tr>
	<tr>
		<td>*</td>
		<td>getMaximum()</td>
		<td>Returns the largest value in the tree.</td>
		<td>2.0.0</td>
	</tr>
	<tr>
		<td>Number</td>
		<td>getHeight()</td>
		<td>Returns the height of the tree (the maximum depth).</td>
		<td>2.0.0</td>
	</tr>
	<tr>
		<td>Array</td>
		<td>getValues()</td>
		<td>Returns all values in the tree as an array in sorted order.</td>
		<td>2.0.0</td>
	</tr>
	<tr>
		<td>Void</td>
		<td>inOrderTraverse(Function, startValue)</td>
		<td>Performs an in-order traversal of the tree and calls the passed function on each traversed node. Optionally starting from the smallest node with a value &gt;= to startValue. The traversal ends after traversing the tree's maximum node or when the passed function returns true.</td>
		<td>2.0.0</td>
	</tr>
	<tr>
		<td>Void</td>
		<td>reverseOrderTraverse(Function, startValue)</td>
		<td>Performs a reverse-order traversal of the tree and calls the passed function on each node. Optionally starts from the largest node with a value &lt;= to the specified  start value. The traversal ends after traversing the tree's minimum node or when the passed function returns true.</td>
		<td>2.0.0</td>
	</tr>
	<tr>
		<td>*</td>
		<td>printAVLTree()</td>
		<td>Outputs the AVLTree to console. Internet Explorer hates this with a passion. Use only for debug purposes.</td>
		<td>2.0.0</td>
	</tr>
</table>

AVLNode
=======

The AVLNode structure has its own methods which can be run. The AVLNode constructor is not exposed, and is only used internaly within AVLTree. However, there follows a method summary on what you can do with the AVLNode when you return or get them from the tree.
## Property Summary

<table>
	<tr>
		<th>Property</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>value</td>
		<td>*</td>
		<td>The value stored in the node. Bust be strings or numbers. Objects can be stored if converted to strings with JSON.stringify first. Ensure that you specify a relevant sort function for these to parse and then check values.</td>
	</tr>
	<tr>
		<td>count</td>
		<td>Number</td>
		<td>Number of nodes in the subtree rooted at this node.</td>
	</tr>
	<tr>
		<td>height</td>
		<td>Number</td>
		<td>The height of this tree rooted at this node.</td>
	</tr>
</table>

## Method Summary
<table>
	<tr>
		<th>Return</th>
		<th>Method Name</th>
		<th>Method Description</th>
		<th>Version Introduced</th>
	</tr>
	<tr>
		<td>Boolean</td>
		<td>isRightChild()</td>
		<td>Returns true if the specified node has a parent and is the right child of its parent.</td>
		<td>2.0.0</td>
	</tr>
	<tr>
		<td>AVLNode</td>
		<td>isLeftChild()</td>
		<td>Returns true if the specified node has a parent and is the left child of its parent.</td>
		<td>2.0.0</td>
	</tr>
</table>