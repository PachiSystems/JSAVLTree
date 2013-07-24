/*
 * AVLTree for JavaScript.
 * An implementation of a self-balancing binary search tree.
 * Copyright 2013, Brian Milton
 * Version: 0.0.1 (24th July 2013)
 */
(function( window , undefined ) {
	
	// AVLTree Constructor
	function AVLTree() {
		this._root = null;
		this._lastnode;
		this._deleteNode;
	}
	
	// AVL Tree Private methods
	var HEIGHT = function(node) {
		if(node === null) {
			return -1;
		} else {
			return Math.max(HEIGHT(node.getLeft()),HEIGHT(node.getRight())) + 1;
		}
	}
	
	var SINGLE_ROTATE_LEFT = function(node) {
		var rotator = node.getRight();
		node.setRight(rotator.getLeft());
		rotator.setLeft(node);
		return rotator;
	}
	
	var SINGLE_ROTATE_RIGHT = function(node) {
		var rotator = node.getLeft();
		node.setLeft(rotator.getRight());
		rotator.setRight(node);
		return rotator;
	}
	
	var DOUBLE_ROTATE_LEFT = function(node) {
		node.setRight(SINGLE_ROTATE_RIGHT(node.getRight()));
		return SINGLE_ROTATE_LEFT(node);
	}
	
	var DOUBLE_ROTATE_RIGHT = function(node) {
		node.setLeft(SINGLE_ROTATE_LEFT(node.getLeft()));
		return SINGLE_ROTATE_RIGHT(node);
	}
	
	var INSERT = function(key, node) {
		if(node === null) {
			node = new AVLNode(key);
		} else if (key < node.getItem()) {
			node.setLeft(INSERT(key, node.getLeft()));
			if (node.getLeft() !== null) {
				if((HEIGHT(node.getLeft()) - HEIGHT(node.getRight())) === 2) {
					if(key < node.getLeft().getItem()) {
						node = SINGLE_ROTATE_RIGHT(node);
					} else {
						node = DOUBLE_ROTATE_RIGHT(node);
					}
				}
			}
		} else if (key > node.getItem()) {
			node.setRight(INSERT(key, node.getRight()));
			if(node.getRight() !== null) {
				if((HEIGHT(node.getRight()) - HEIGHT(node.getLeft())) === 2) {
					if(key>node.getRight().getItem()) {
						node = SINGLE_ROTATE_LEFT(node);
					} else {
						node = DOUBLE_ROTATE_LEFT(node);
					}
				}
			}
		} else {
			// It's a duplicate... These are not allowed in an AVL... Naughty naughty.
		}
		return node;
	}
	
	var DELETE = function(key, node) {
		if (node === null) {
			return null;
		}
		this._lastNode = node;
		
		if(key < node.getItem()) {
			node.setLeft(DELETE(key,node.getLeft()));
		} else {
			this._deleteNode = node;
			node.setRight(DELETE(key,node.getRight()));
		}
		
		if(node === this._lastNode) {
			if(this._deleteNode !== null && key === this._deleteNode.getItem()){
				if(this._deleteNode === this._lastNode) {
					node = node.getLeft();
				} else {
					var tmp = this._deleteNode.getItem();
					this._deleteNode.setItem(this._lastNode.getItem());
					this._lastNode.setItem(tmp);
					node = node.getRight();
				}
			}
		} else {
			if((HEIGHT(node.getLeft()) - HEIGHT(node.getRight())) === 2) {
				if(key < node.getLeft().getItem()){
					node = SINGLE_ROTATE_RIGHT(node);
				} else {
					node = DOUBLE_ROTATE_RIGHT(node);
				}
			}
			
			if((HEIGHT(node.getRight()) - HEIGHT(node.getLeft())) === 2) {
				if(key>node.getRight().getItem()) {
					node = SINGLE_ROTATE_LEFT(node);
				} else {
					node = DOUBLE_ROTATE_LEFT(node);
				}
			}
		}
	}
	
	var REMOVE_MIN_NODE = function(node) {
		if(node === null) {
			// Tree is empty.
			return null;
		} else if (node.getLeft() !== null) {
			node.setLeft(REMOVE_MIN_NODE(node.getLeft()));
			return node;
		} else {
			return node.getRight();
		}
	}
	
	var REMOVE_MAX_NODE = function(node) {
		if(node === null) {
			// Tree is empty.
			return null;
		} else if (node.getRight() !== null) {
			node.setRight(REMOVE_MAX_NODE(node.getRight()));
			return node;
		} else {
			return node.getLeft();
		}
	}
	
	// AVLTree Public methods
	AVLTree.prototype.getRoot = function() {
		return this._root;
	}
	
	AVLTree.prototype.height = function(node) {
		if(!node) {
			node = this._root;
		}
		return HEIGHT(node);
	}
	
	AVLTree.prototype.insertNode = function(key) {
		this._root = INSERT(key,this._root);
	}
	
	AVLTree.prototype.deleteNode = function(key) {
		this._lastNode = null;
		this._deleteNode = null;
		this._root = DELETE(key, this._root);
	}
	
	AVLTree.prototype.findMinNode = function(node) {
		if(node !== null) {
			while(node.getLeft() !== null) {
				node = node.getLeft();
			}
		}
		return node;
	}
	
	AVLTree.prototype.findMaxNode = function(node) {
		if(node !== null) {
			while(node.getRight() !== null) {
				node = node.getRight();
			}
		}
		return node;
	}
	
	AVLTree.prototype.removeMinNode = function(node) {
		return REMOVE_MIN_NODE(node);
	}
	
	AVLTree.prototype.removeMaxNode = function(node) {
		return REMOVE_MAX_NODE(node);
	}
	
	AVLTree.prototype.printAVLTree = function() {
		return this._root.preorderPrint();
	}
	
	// AVLNode Constructor
	function AVLNode(item) {
		this._item = item || null;
		this._left = null;
		this._right = null;
		this._height = null;
	}
	
	AVLNode.prototype.getItem = function() {
		return this._item;
	}
	
	AVLNode.prototype.getLeft = function() {
		return this._left;
	}
	
	AVLNode.prototype.setLeft = function(node) {
		this._left = node;
	}
	
	AVLNode.prototype.getRight = function() {
		return this._right;
	}
	
	AVLNode.prototype.setRight = function(node) {
		this._right = node;
	}
	
	AVLNode.prototype.getHeight = function() {
		return this._height;
	}
	
	AVLNode.prototype.size = function(node) {
		if(node === null) {
			return 0;
		} else {
			return this.size(node.getLeft()) + this.size(node.getRight()) + 1;
		}
	}
	
	AVLNode.prototype.preorderPrint = function(padding) {
		padding = padding || "";
		padding = "-" + padding;
		
		console.log(padding + this._item);
		
		if(this._left !== null) {
			this._left.preorderPrint(padding);
		}
		
		if(this._right !== null) {
			this._right.preorderPrint(padding);
		}
	}
	
	AVLNode.prototype.inorderPrint = function(padding) {
		padding = padding || '';
        padding = '--' + padding;

        if (this._left !== null) {
            this._left.inorderPrint(padding);
        }

        console.log(padding + this._item);

        if (this._right !== null) {
            this._right.inorderPrint(padding);
        }
	}
	
	AVLNode.prototype.postorderPrint = function(padding) {
        padding = padding || '';
        padding = '--' + padding;

        if (this._left !== null) {
            this._left.postorderPrint(padding);
        }

        if (this._right !== null) {
            this._right.postorderPrint(padding);
        }

        console.log(padding + this._item);
    }

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
})( window );