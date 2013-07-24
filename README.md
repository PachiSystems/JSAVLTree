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
		<td>AVLTree()</td>
		<td>Creates an empty AVL Tree (self-balancing binary search tree)</td>
		<td>1.0.0</td>
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
		<td>AVLNode</td>
		<td>getRoot()</td>
		<td>Returns the root node of the AVLTree object.</td>
		<td>1.0.0</td>
	</tr>
	<tr>
		<td>Integer</td>
		<td>height(AVLNode)</td>
		<td>Returns the height of the supplied AVLNode object.</td>
		<td>1.0.0</td>
	</tr>
	<tr>
		<td>Void</td>
		<td>insertNode(key)</td>
		<td>Inserts the speficied key into the AVLTree and balances.</td>
		<td>1.0.0</td>
	</tr>
	<tr>
		<td>Void</td>
		<td>deleteNode(key)</td>
		<td>Deletes the specified key from the AVLTree and balances.</td>
		<td>1.0.0</td>
	</tr>
	<tr>
		<td>AVLNode</td>
		<td>findMinNode(AVLNode)</td>
		<td>Finds the left-most node from the supplied AVLNode.</td>
		<td>1.0.0</td>
	</tr>
	<tr>
		<td>AVLNode</td>
		<td>findMaxNode(AVLNode)</td>
		<td>Finds the right-most node from the supplied AVLNode.</td>
		<td>1.0.0</td>
	</tr>
	<tr>
		<td>AVLNode</td>
		<td>removeMinNode(AVLNode)</td>
		<td>Removes and returns the left-most AVLNode from the supplied node and balances.</td>
		<td>1.0.0</td>
	</tr>
	<tr>
		<td>AVLNode</td>
		<td>removeMaxNode(AVLNode)</td>
		<td>Removes and returns the right-most AVLNode from the supplied AVLNode and balances.</td>
		<td>1.0.0</td>
	</tr>
	<tr>
		<td>Void</td>
		<td>printAVLTree()</td>
		<td>Outputs the AVLTree to the console (WARNING: Ensure that developer tools are enabled when using this method)</td>
		<td>1.0.0</td>
	</tr>
</table>

AVLNode
=======

The AVLNode structure has its own methods which can be run. The AVLNode constructor is not exposed, and is only used internaly within AVLTree. However, there follows a method summary on what you can do with the AVLNode when you return or get them from the tree.

## Method Summary
<table>
	<tr>
		<th>Return</th>
		<th>Method Name</th>
		<th>Method Description</th>
		<th>Version Introduced</th>
	</tr>
	<tr>
		<td>Key</td>
		<td>getItem()</td>
		<td>Returns the Key stored in this AVLNode.</td>
		<td>1.0.0</td>
	</tr>
	<tr>
		<td>AVLNode</td>
		<td>getLeft()</td>
		<td>Returns the AVLNode to the left of this node (lower value)</td>
		<td>1.0.0</td>
	</tr>
	<tr>
		<td>Void</td>
		<td>setLeft(AVLNode)</td>
		<td>Sets the left of this node to the specified AVLNode. Does not balance after. Use AVLTree's insertNode method instead.</td>
		<td>1.0.0</td>
	</tr>
	<tr>
		<td>AVLNode</td>
		<td>getRight()</td>
		<td>Returns the AVLNode to the right of this node (higher value)</td>
		<td>1.0.0</td>
	</tr>
	<tr>
		<td>Void</td>
		<td>setRight(AVLNode)</td>
		<td>Sets the right of this node to the specified AVLNode. Does not balance after. Use AVLTree's insertNode method instead.</td>
		<td>1.0.0</td>
	</tr>
	<tr>
		<td>Integer</td>
		<td>getHeight()</td>
		<td>Returns the height of this AVLNode.</td>
		<td>1.0.0</td>
	</tr>
	<tr>
		<td>Integer</td>
		<td>size(AVLNode)</td>
		<td>Returns the size of the tree under the specified AVLNode.</td>
		<td>1.0.0</td>
	</tr>
	<tr>
		<td>Void</td>
		<td>preorderPrint(padding)</td>
		<td>Outputs the pre-ordered tree to console. ```padding``` is used to specify padding between dashes. (WARNING: Ensure that developer tools are enabled when using this method)</td>
		<td>1.0.0</td>
	</tr>
	<tr>
		<td>Void</td>
		<td>inorderPrint(padding)</td>
		<td>Outputs the in-order tree to the console. ```padding``` is used to specify padding between dashes. (WARNING: Ensure that developer tools are enabled when using this method)</td>
		<td>1.0.0</td>
	</tr>
	<tr>
		<td>Void</td>
		<td>postorderPrint</td>
		<td>Outputs the post-ordered tree to console. ```padding``` is used to specify padding between dashes. (WARNING: Ensure that developer tools are enabled when using this method)</td>
		<td>1.0.0</td>
	</tr>
</table>