// C++ program to demonstrate how to take input in an array 
#include <iostream> 
using namespace std; 

// driver code 
int main() 
{ 
	// defining array size 
	int size = 5; 
	// defining array of size "size" 
	int numbers[size]; 

	// using loop to move to every array element and then 
	// using either cin to insert the value given by the 
	// user to the array element 
	for (int i = 0; i < size; i++) { 
		cin >> numbers[i]; 
	} 

	// Print the array elements 
	cout << "The array elements are: "; 
	for (int i = 0; i < size; i++) { 
		cout << numbers[i] << " "; 
	} 

	return 0; 
}
