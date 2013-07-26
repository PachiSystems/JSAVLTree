/**
 * AVLTree for JavaScript.
 * An implementation of a self-balancing binary search tree.
 * Copyright 2013
 * @author Brian Milton
 * @version 2.0.0
 */

(function(window, undefined) {

	/**
	 * A pure-JS implementation of bind.
	 * @param {Function} fn A function to partially apply.
	 * @param {Object|undefined} selfObj Specifies the object which |this| should
	 *     point to when the function is run.
	 * @param {...*} arguments Additional arguments that are partially
	 *     applied to the function.
	 * @return {!Function} A partially-applied form of the function bind() was
	 *     invoked as a method of.
	 * @private
	 */
	var BIND = function(fn, selfObj, arguments) {
		if (!fn) {
			throw new Error();
		}

		if (arguments.length > 2) {
			var boundArgs = Array.prototype.slice.call(arguments, 2);
			return function() {
				// Prepend the bound arguments to the current arguments.
				var newArgs = Array.prototype.slice.call(arguments);
				Array.prototype.unshift.apply(newArgs, boundArgs);
				return fn.apply(selfObj, newArgs);
			};

		} else {
			return function() {
				return fn.apply(selfObj, arguments);
			};
		}
	}
	
	/**
	 * Constructs an AVL-Tree, which uses the specified comparator to order its
	 * values. The tree enforces a O(logn) maximum height.
	 *
	 * @param {Function=} comparator Function used to order the tree's nodes.
	 * @constructor
	 */
	AVLTree = function(comparator) {
		this._comparator = comparator || AVLTree.DEFAULT_COMPARATOR;
	};

	/**
	 * String comparison function used to compare values in the tree. This function
	 * is used by default if no comparator is specified in the tree's constructor.
	 *
	 * @param {string} a The first string.
	 * @param {string} b The second string.
	 * @return {number} -1 if a < b, 1 if a > b, 0 if a = b.
	 * @private
	 */
	AVLTree.DEFAULT_COMPARATOR = function(a, b) {
		if (String(a) < String(b)) {
			return -1;
		} else if (String(a) > String(b)) {
			return 1;
		}
		return 0;
	};

	/**
	 * Pointer to the root node of the tree.
	 *
	 * @type {AVLTree.Node}
	 * @private
	 */
	AVLTree.prototype._root = null;

	/**
	 * Comparison function used to compare values in the tree. This function should
	 * take two values, a and b, and return x where:
	 *  x < 0 if a < b,
	 *  x > 0 if a > b,
	 *  x = 0 otherwise
	 *
	 * @type {Function}
	 * @private
	 */
	AVLTree.prototype._comparator = null;

	/**
	 * Pointer to the node with the smallest value in the tree.
	 *
	 * @type {AVLTree.Node}
	 * @private
	 */
	AVLTree.prototype._minNode = null;

	/**
	 * Pointer to the node with the largest value in the tree.
	 *
	 * @type {AVLTree.Node}
	 * @private
	 */
	AVLTree.prototype._maxNode = null;

	/**
	 * Inserts a node into the tree with the specified value if its not a 
	 * duplicate. If the value is inserted, the tree is balanced to enforce
	 * the AVL-Tree height property.
	 *
	 * @param {*} value Value to insert into the tree.
	 * @return {boolean} Whether value was inserted into the tree.
	 */
	AVLTree.prototype.add = function(value) {
		// If the tree is empty, create a root node with the specified value and stop there.
		if (this._root == null) {
			this._root = new AVLTree.Node(value);
			this._minNode = this._root;
			this._maxNode = this._root;
			return true;
		}

		// This will be set to the new node if a new node is added.
		var newNode = null;

		// Traverse the tree and insert the value if we reach a null node
		this._traverse(function(node) {
			var retNode = null;
			if (this._comparator(node.value, value) > 0) {
				retNode = node._left;
				if (node._left == null) {
					newNode = new AVLTree.Node(value, node);
					node._left = newNode;
					if (node == this._minNode) {
						this._minNode = newNode;
					}
				}
			} else if (this._comparator(node.value, value) < 0) {
				retNode = node._right;
				if (node._right == null) {
					newNode = new AVLTree.Node(value, node);
					node._right = newNode;
					if (node == this._maxNode) {
						this._maxNode = newNode;
					}
				}
			}
			return retNode; // If null, we'll stop traversing the tree
		});

		// If a node was added, increment counts and balance tree.
		if (newNode) {
			this._traverse(function(node) {
				node.count++;
				return node._parent;
			}, newNode._parent);
			this._balance(newNode._parent);  // Maintain the AVL-tree balance
		}

		// Return true if a node was added, false otherwise
		return !!newNode;
	};

	/**
	 * Removes a node from the tree with the specified value if it exists. If 
	 * a node is removed the tree is balanced again. The value of the removed 
	 * node is returned or null.
	 *
	 * @param {*} value Value to find and remove from the tree.
	 * @return {*} The value of the removed node or null if the value was not in
	 *     the tree.
	 */
	AVLTree.prototype.remove = function(value) {
		// Assume the value is not removed and set the value when it is removed
		var retValue = null;

		// Depth traverse the tree and remove the value if we find it
		this._traverse(function(node) {
			var retNode = null;
			if (this._comparator(node.value, value) > 0) {
				retNode = node._left;
			} else if (this._comparator(node.value, value) < 0) {
				retNode = node._right;
			} else {
				retValue = node.value;
				this._removeNode(node);
			}
			return retNode;  // If null, we'll stop traversing the tree
		});

		// Return the value that was removed, null if the value was not in the tree
		return retValue;
	};

	/**
	 * Removes all nodes from the tree.
	 */
	AVLTree.prototype.clear = function() {
		this._root = null;
		this._minNode = null;
		this._maxNode = null;
	};

	/**
	 * Returns true if the tree contains a node with the specified value, false
	 * otherwise.
	 *
	 * @param {*} value Value to find in the tree.
	 * @return {boolean} Whether the tree contains a node with the specified value.
	 */
	AVLTree.prototype.contains = function(value) {
		// Assume the value is not in the tree and set this value if it is found
		var isContained = false;

		// Depth traverse the tree and set isContained if we find the node
		this._traverse(function(node) {
			var retNode = null;
			if (this._comparator(node.value, value) > 0) {
				retNode = node._left;
			} else if (this._comparator(node.value, value) < 0) {
				retNode = node._right;
			} else {
				isContained = true;
			}
			return retNode;
			// If null, we'll stop traversing the tree
		});

		// Return true if the value is contained in the tree, false otherwise
		return isContained;
	};

	/**
	 * Returns the number of values stored in the tree.
	 *
	 * @return {number} The number of values stored in the tree.
	 */
	AVLTree.prototype.getCount = function() {
		return this._root ? this._root.count : 0;
	};

	/**
	 * Returns an n-th smallest value, based on the comparator:
	 * where 0 <= n < this.getCount().
	 * @param {number} n The number n.
	 * @return {*} The n-th smallest value.
	 */
	AVLTree.prototype.getNthValue = function(n) {
		if (n < 0 || n >= this.getCount()) {
			return null;
		}
		return this._getNthNode(n).value;
	};

	/**
	 * Returns the smallest value in the tree.
	 *
	 * @return {*} The minimum value contained in the tree.
	 */
	AVLTree.prototype.getMinimum = function() {
		return this._getMinNode().value;
	};

	/**
	 * Returns the largest value in the tree.
	 *
	 * @return {*} The maximum value contained in the tree.
	 */
	AVLTree.prototype.getMaximum = function() {
		return this._getMaxNode().value;
	};

	/**
	 * Returns the height of the tree (the maximum depth).
	 *
	 * @return {number} The height of the tree.
	 */
	AVLTree.prototype.getHeight = function() {
		return this._root ? this._root.height : 0;
	};

	/**
	 * Inserts the values stored in the tree into a new Array and returns the Array.
	 *
	 * @return {Array} An array containing all of the trees values in sorted order.
	 */
	AVLTree.prototype.getValues = function() {
		var retVal = [];
		this.inOrderTraverse(function(value) {
			retVal.push(value);
		});
		return retVal;
	};

	/**
	 * Performs an in-order traversal of the tree and calls the passed function on each
	 * traversed node. Optionally starting from the smallest node with a value >= to
	 * startValue. The traversal ends after traversing the tree's maximum node or when
	 * the passed function returns true.
	 *
	 * @param {Function} func Function to call on each traversed node.
	 * @param {Object=} startValue If specified, traversal will begin on the
	 *    node with the smallest value >= startValue.
	 */
	AVLTree.prototype.inOrderTraverse = function(func, startValue) {
		// If our tree is empty, return immediately
		if (!this._root) {
			return;
		}

		// Depth traverse the tree to find node to begin in-order traversal from
		var startNode;
		if (startValue) {
			this._traverse(function(node) {
				var retNode = null;
				if (this._comparator(node.value, startValue) > 0) {
					retNode = node._left;
					startNode = node;
				} else if (this._comparator(node.value, startValue) < 0) {
					retNode = node._right;
				} else {
					startNode = node;
				}
				return retNode;  // If null, we'll stop traversing the tree
			});
		} else {
			startNode = this._getMinNode();
		}

		// Traverse the tree and call func on each traversed node's value
		var node = startNode, previous = startNode._left ? startNode._left : startNode;
		while (node != null) {
			if (node._left != null && node._left != previous && node._right != previous) {
				node = node._left;
			} else {
				if (node._right != previous) {
					if (func(node.value)) {
						return;
					}
				}
				var temp = node;
				node = node._right != null && node._right != previous ? node._right : node._parent;
				previous = temp;
			}
		}
	};

	/**
	 * Performs a reverse-order traversal of the tree and calls the passed function on
	 * each node. Optionally starts from the largest node with a value <= to the specified 
	 * start value. The traversal ends after traversing the tree's minimum node or when
	 * the passed function returns true.
	 *
	 * @param {Function} func Function to call on each traversed node.
	 * @param {Object=} startValue If specified, traversal will begin on the
	 *    node with the largest value <= startValue.
	 */
	AVLTree.prototype.reverseOrderTraverse = function(func, startValue) {
		// If our tree is empty, return immediately
		if (!this._root) {
			return;
		}

		// Depth traverse the tree to find node to begin reverse-order traversal from
		var startNode;
		if (startValue) {
			this._traverse(BIND(function(node) {
				var retNode = null;
				if (this._comparator(node.value, startValue) > 0) {
					retNode = node._left;
				} else if (this._comparator(node.value, startValue) < 0) {
					retNode = node._right;
					startNode = node;
				} else {
					startNode = node;
				}
				return retNode;
				// If null, we'll stop traversing the tree
			}, this));
		} else {
			startNode = this._getMaxNode();
		}

		// Traverse the tree and call func on each traversed node's value
		var node = startNode, prev = startNode._right ? startNode._right : startNode;
		while (node != null) {
			if (node._right != null && node._right != prev && node._left != prev) {
				node = node._right;
			} else {
				if (node._left != prev) {
					if (func(node.value)) {
						return;
					}
				}
				var temp = node;
				node = node._left != null && node._left != prev ? node._left : node._parent;
				prev = temp;
			}
		}
	};
	
	/**
	 * Outputs the AVLTree to console. Internet Explorer hates this with a passion.
	 * Use only for debug purposes.
	 */
	AVLTree.prototype.printAVLTree = function() {
		if(this._root !== null) {
			return this._root._inOrderPrint();
		}
		return false;
	}

	/**
	 * Performs a traversal defined by the supplied traversal function. The first
	 * call to the traversal function is performed on the root or the optionally
	 * specified startNode. After that, it calls the traversal function with the
	 * node returned by the previous call until the traversal function returns 
	 * null or the optionally specified end node.
	 *
	 * @param {Function} traversalFunc Function used to traverse the tree. Takes a
	 *     node as a parameter and returns a node.
	 * @param {AVLTree.Node=} startNode The node at which the traversal begins.
	 * @param {AVLTree.Node=} endNode The node at which the traversal ends.
	 * @private
	 */
	AVLTree.prototype._traverse = function(traversalFunc, startNode, endNode) {
		var node = startNode ? startNode : this._root;
		var endNode = endNode ? endNode : null;
		while (node && node != endNode) {
			node = traversalFunc.call(this, node);
		}
	};

	/**
	 * Ensures that the specified node and all its ancestors are balanced. If they
	 * are not, performs left and right rotations to achieve a balanced tree. This 
	 * method assumes that at most 2 rotations are necessary to balance the tree.
	 *
	 * @param {AVLTree.Node} node Node to begin balance from.
	 * @private
	 */
	AVLTree.prototype._balance = function(node) {

		this._traverse(function(node) {
			// Calculate the left and right node's heights
			var leftHeight = node._left ? node._left.height : 0;
			var rightHeight = node._right ? node._right.height : 0;

			// Rotate tree rooted at this node if it is not AVL-tree balanced
			if (leftHeight - rightHeight > 1) {
				if (node._left._right && (!node._left._left || node._left._left.height < node._left._right.height)) {
					this._leftRotate(node._left);
				}
				this._rightRotate(node);
			} else if (rightHeight - leftHeight > 1) {
				if (node._right._left && (!node._right._right || node._right._right.height < node._right._left.height)) {
					this._rightRotate(node._right);
				}
				this._leftRotate(node);
			}

			// Recalculate the left and right node's heights
			leftHeight = node._left ? node._left.height : 0;
			rightHeight = node._right ? node._right.height : 0;

			// Set this node's height
			node.height = Math.max(leftHeight, rightHeight) + 1;

			// Traverse up tree and balance parent
			return node._parent;
		}, node);

	};

	/**
	 * Performs a left rotation on the specified node.
	 *
	 * @param {AVLTree.Node} node Pivot node to rotate from.
	 * @private
	 */
	AVLTree.prototype._leftRotate = function(node) {
		// Re-assign parent-child references for the parent of the node being removed
		if (node.isLeftChild()) {
			node._parent._left = node._right;
			node._right._parent = node._parent;
		} else if (node.isRightChild()) {
			node._parent._right = node._right;
			node._right._parent = node._parent;
		} else {
			this._root = node._right;
			this._root._parent = null;
		}

		// Re-assign parent-child references for the child of the node being removed
		var temp = node._right;
		node._right = node._right._left;
		if (node._right != null)
			node._right._parent = node;
		temp._left = node;
		node._parent = temp;

		// Update counts.
		temp.count = node.count;
		node.count -= (temp._right ? temp._right.count : 0) + 1;
	};

	/**
	 * Performs a right tree rotation on the specified node.
	 *
	 * @param {AVLTree.Node} node Pivot node to rotate from.
	 * @private
	 */
	AVLTree.prototype._rightRotate = function(node) {
		// Re-assign parent-child references for the parent of the node being removed
		if (node.isLeftChild()) {
			node._parent._left = node._left;
			node._left._parent = node._parent;
		} else if (node.isRightChild()) {
			node._parent._right = node._left;
			node._left._parent = node._parent;
		} else {
			this._root = node._left;
			this._root._parent = null;
		}

		// Re-assign parent-child references for the child of the node being removed
		var temp = node._left;
		node._left = node._left._right;
		if (node._left != null)
			node._left._parent = node;
		temp._right = node;
		node._parent = temp;

		// Update counts.
		temp.count = node.count;
		node.count -= (temp._left ? temp._left.count : 0) + 1;
	};

	/**
	 * Removes the specified node from the tree and ensures the tree still
	 * maintains the AVL-tree balance.
	 *
	 * @param {AVLTree.Node} node The node to be removed.
	 * @private
	 */
	AVLTree.prototype._removeNode = function(node) {
		// Perform normal binary tree node removal, but balance the tree, starting
		// from where we removed the node
		if (node._left != null || node._right != null) {
			var balanceBegin = null;  // Node to begin balance from
			var replacementNode;  // Node to replace the node being removed
			if (node._left != null) {
				r = this._getMaxNode(node._left);

				// Update counts.
				this._traverse(function(node) {
					node.count--;
					return node._parent;
				}, replacementNode);

				if (replacementNode != node._left) {
					replacementNode._parent._right = replacementNode._left;
					if (replacementNode._left)
						replacementNode._left._parent = replacementNode._parent;
					replacementNode._left = node._left;
					replacementNode._left._parent = replacementNode;
					balanceBegin = replacementNode._parent;
				}
				replacementNode._parent = node._parent;
				replacementNode._right = node._right;
				if (replacementNode._right)
					replacementNode._right._parent = replacementNode;
				if (node == this._maxNode)
					this._maxNode = replacementNode;
				replacementNode.count = node.count;
			} else {
				r = this._getMinNode(node._right);

				// Update counts.
				this._traverse(function(node) {
					node.count--;
					return node._parent;
				}, replacementNode);

				if (replacementNode != node._right) {
					replacementNode._parent._left = replacementNode._right;
					if (replacementNode._right)
						replacementNode._right._parent = replacementNode._parent;
					replacementNode._right = node._right;
					replacementNode._right._parent = replacementNode;
					balanceBegin = replacementNode._parent;
				}
				replacementNode._parent = node._parent;
				replacementNode._left = node._left;
				if (replacementNode._left)
					replacementNode._left._parent = replacementNode;
				if (node == this._minNode)
					this._minNode = replacementNode;
				replacementNode.count = node.count;
			}

			// Update the parent of the node being removed to point to its replace
			if (node.isLeftChild()) {
				node._parent._left = replacementNode;
			} else if (node.isRightChild()) {
				node._parent._right = replacementNode;
			} else {
				this._root = replacementNode;
			}

			// Balance the tree
			this._balance( balanceBegin ? balanceBegin : replacementNode);
		} else {
			// Update counts.
			this._traverse(function(node) {
				node.count--;
				return node._parent;
			}, node._parent);

			// If the node is a leaf, remove it and balance starting from its parent
			if (node.isLeftChild()) {
				this.special = 1;
				node._parent._left = null;
				if (node == this._minNode)
					this._minNode = node._parent;
				this._balance(node._parent);
			} else if (node.isRightChild()) {
				node._parent._right = null;
				if (node == this._maxNode)
					this._maxNode = node._parent;
				this._balance(node._parent);
			} else {
				this.clear();
			}
		}
	};

	/**
	 * Returns the node in the tree that has n nodes before it in an in-order
	 * traversal, optionally rooted at the root node.
	 *
	 * @param {number} n The number of nodes before the node to be returned in an
	 *     in-order traversal, where 0 <= n < root.count.
	 * @param {AVLTree.Node=} rootNode Optional root node.
	 * @return {AVLTree.Node} The node at the specified index.
	 * @private
	 */
	AVLTree.prototype._getNthNode = function(n, rootNode) {
		var root = rootNode || this._root;
		var numNodesInLeftSubtree = root._left ? root._left.count : 0;

		if (n < numNodesInLeftSubtree) {
			return this._getNthNode(n, root._left);
		} else if (n == numNodesInLeftSubtree) {
			return root;
		} else {
			return this._getNthNode(n - numNodesInLeftSubtree - 1, root._right);
		}
	};

	/**
	 * Returns the node with the smallest value in tree, optionally rooted at
	 * the root node.
	 *
	 * @param {AVLTree.Node=} rootNode Optional root node.
	 * @return {AVLTree.Node} The node with the smallest value in
	 *     the tree.
	 * @private
	 */
	AVLTree.prototype._getMinNode = function(rootNode) {
		if (!rootNode) {
			return this._minNode;
		}

		var minNode = rootNode;
		this._traverse(function(node) {
			var retNode = null;
			if (node._left) {
				minNode = node._left;
				retNode = node._left;
			}
			return retNode;
			// If null, we'll stop traversing the tree
		}, rootNode);

		return minNode;
	};

	/**
	 * Returns the node with the largest value in tree, optionally rooted at
	 * the root node.
	 *
	 * @param {AVLTree.Node=} rootNode Optional root node.
	 * @return {AVLTree.Node} The node with the largest value in
	 *     the tree.
	 * @private
	 */
	AVLTree.prototype._getMaxNode = function(rootNode) {
		if (!rootNode) {
			return this._maxNode;
		}

		var maxNode = rootNode;
		this._traverse(function(node) {
			var retNode = null;
			if (node._right) {
				maxNode = node._right;
				retNode = node._right;
			}
			return retNode;
			// If null, we'll stop traversing the tree
		}, rootNode);

		return maxNode;
	};

	/**
	 * Constructs an AVL-Tree node with the specified value. If no parent is
	 * specified, the node's parent is assumed to be null and thus, root. The
	 * node's height defaults to 1 and its children default to null.
	 *
	 * @param {*} value Value to store in the node.
	 * @param {AVLTree.Node=} parent Optional parent node.
	 * @constructor
	 */
	AVLTree.Node = function(value, parent) {
		this.value = value;
		this._parent = parent ? parent : null;
		this.count = 1;  // Number of nodes in the subtree rooted at this node.
	};
	
	/**
	 * Prints out the ordered list to console. Will break Internet Explorer. Use for debugging only.
	 * 
	 * @param {String} padding Used by the method to increase padding for the node.
	 * @private 
	 */
	AVLTree.Node.prototype._inOrderPrint = function(padding) {
		
		padding = padding || "";
		
		padding = "--" + padding;
		
		if(this._left !== null) {
			this._left._inOrderPrint(padding);
		}
		
		console.log(padding + this.value);
		
		if(this._right !== null) {
			this._right._inOrderPrint(padding);
		}
	};

	/**
	 * The node's left child. Null if the node does not have a left child.
	 *
	 * @type {AVLTree.Node?}
	 */
	AVLTree.Node.prototype._left = null;

	/**
	 * The node's right child. Null if the node does not have a right child.
	 *
	 * @type {AVLTree.Node?}
	 */
	AVLTree.Node.prototype._right = null;

	/**
	 * The height of the tree rooted at this node.
	 *
	 * @type {number}
	 */
	AVLTree.Node.prototype.height = 1;

	/**
	 * Returns true if the specified node has a parent and is the right child of
	 * its parent.
	 *
	 * @return {boolean} Whether the specified node has a parent and is the right
	 *    child of its parent.
	 */
	AVLTree.Node.prototype.isRightChild = function() {
		return !!this._parent && this._parent._right == this;
	};

	/**
	 * Returns true if the specified node has a parent and is the left child of
	 * its parent.
	 *
	 * @return {boolean} Whether the specified node has a parent and is the left
	 *    child of its parent.
	 */
	AVLTree.Node.prototype.isLeftChild = function() {
		return !!this._parent && this._parent._left == this;
	};

	// Module Export Code
	if ( typeof module === "object" && module && typeof module.exports === "object") {
		// Expose AVLTree as module.exports in loaders that implement the Node
		// module pattern (including browserify). Do not create the global, since
		// the user will be storing it themselves locally, and globals are frowned
		// upon in the Node module world.
		module.exports = AVLTree;
	} else {
		// Otherwise expose AVLTree to the global object as usual
		window.AVLTree = AVLTree;

		// Register as a named AMD module.
		if ( typeof define === "function" && define.amd) {
			define("avltree", [], function() {
				return AVLTree;
			});
		}
	}
})(window);
