### Dna Visual
!Under construction - early beta stages!

A set of DNA Visualization tools for react
Currently supports
1. Sequence viewer
1.1 Annotations
1.2 Restriction sites with auto detection
1.3 Selection
1.4 Togglable minus strand

Utils - AutoSizer

Coming soon
1. ORF detection
2. DNA editing tool
3. Circular viewer

### Rquirements
1. React > 15
2. React Virtualized > 9

### Basic props
sequence - A DNA sequence (ATGC - we currently don't validate the sequence so will display anything)
annotations - [{ startIndex: Int, endIndex: Int, name: String, color: ?HexColor }]
restrictionSites - [{ startIndex: Int, endIndex: Int, name: String, overhang: Int, cutIndex3_5: Int, direction: (1|-1) }]
minusStrand - Boolean - Show/Hide minus strand
width - Int - container width - Can user autosizer for detection





